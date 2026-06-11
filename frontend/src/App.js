import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';
import './index.css';

function App() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      background: '#0d1117', overflow: 'hidden',
    }}>
      <PipelineToolbar />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <PipelineUI />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;