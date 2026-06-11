from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from collections import deque

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


# ── typed models 
class Node(BaseModel):
    id: str
    type: str | None = None
    data: dict[str, Any] = {}
    position: dict[str, float] = {}

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str | None = None
    targetHandle: str | None = None

class Pipeline(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


# ── DAG check via Kahn's algorithm 
def is_dag(nodes: list[Node], edges: list[Edge]) -> bool:
    node_ids  = {n.id for n in nodes}
    in_degree = {nid: 0 for nid in node_ids}
    adj       = {nid: [] for nid in node_ids}

    for edge in edges:
        src, tgt = edge.source, edge.target
        if src not in node_ids or tgt not in node_ids:
            continue
        adj[src].append(tgt)
        in_degree[tgt] += 1

    queue   = deque(nid for nid in node_ids if in_degree[nid] == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbour in adj[node]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)

    return visited == len(node_ids)


# ── endpoint 
@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag':    is_dag(pipeline.nodes, pipeline.edges),
    }