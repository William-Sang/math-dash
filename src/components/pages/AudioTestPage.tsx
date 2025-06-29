import { useAudio } from '../../hooks/useAudio';

export default function AudioTestPage() {
  const { 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    musicEnabled, 
    setMusicEnabled,
    musicVolume,
    setMusicVolume
  } = useAudio();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-3xl font-bold mb-8">音频测试页面</h1>
      
      <div className="card p-6 space-y-4 max-w-sm w-full">
        <p className="text-center">使用下面的控件来测试背景音乐功能。</p>
        
        <div className="flex items-center justify-between">
          <label htmlFor="musicEnabled" className="font-semibold">启用音乐:</label>
          <input
            type="checkbox"
            id="musicEnabled"
            checked={musicEnabled}
            onChange={(e) => setMusicEnabled(e.target.checked)}
            className="checkbox checkbox-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="volume" className="font-semibold">音量: {Math.round(musicVolume * 100)}%</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="range range-primary"
          />
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={() => playBackgroundMusic()} 
            className="btn btn-success"
            disabled={!musicEnabled}
          >
            播放音乐
          </button>
          <button 
            onClick={() => stopBackgroundMusic()} 
            className="btn btn-danger"
          >
            停止音乐
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>请打开浏览器开发者工具 (F12) 并查看 Console 面板的日志输出。</p>
      </div>
    </div>
  );
} 