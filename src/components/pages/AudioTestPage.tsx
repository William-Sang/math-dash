import { useAudio } from '../../hooks/useAudio';
import { useEffect, useState } from 'react';

export default function AudioTestPage() {
  const { 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    musicEnabled, 
    setMusicEnabled,
    musicVolume,
    setMusicVolume,
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    playSound
  } = useAudio();

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog('音频测试页面已加载');
  }, []);

  const handlePlayMusic = () => {
    addLog('尝试播放背景音乐...');
    playBackgroundMusic();
  };

  const handleStopMusic = () => {
    addLog('尝试停止背景音乐...');
    stopBackgroundMusic();
  };

  const handlePlaySound = (soundName: string) => {
    addLog(`尝试播放音效: ${soundName}`);
    playSound(soundName as any);
  };

  const handleToggleMusic = (enabled: boolean) => {
    addLog(`音乐开关变更: ${enabled ? '开启' : '关闭'}`);
    setMusicEnabled(enabled);
  };

  const handleToggleSound = (enabled: boolean) => {
    addLog(`音效开关变更: ${enabled ? '开启' : '关闭'}`);
    setSoundEnabled(enabled);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-3xl font-bold mb-8">音频测试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* 音乐控制 */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-semibold">背景音乐控制</h2>
          
          <div className="flex items-center justify-between">
            <label htmlFor="musicEnabled" className="font-semibold">启用音乐:</label>
            <input
              type="checkbox"
              id="musicEnabled"
              checked={musicEnabled}
              onChange={(e) => handleToggleMusic(e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="musicVolume" className="font-semibold">音量: {Math.round(musicVolume * 100)}%</label>
            <input
              type="range"
              id="musicVolume"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="range range-primary w-full"
            />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={handlePlayMusic} 
              className="btn btn-success"
              disabled={!musicEnabled}
            >
              播放音乐
            </button>
            <button 
              onClick={handleStopMusic} 
              className="btn btn-danger"
            >
              停止音乐
            </button>
          </div>
        </div>

        {/* 音效控制 */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-semibold">音效控制</h2>
          
          <div className="flex items-center justify-between">
            <label htmlFor="soundEnabled" className="font-semibold">启用音效:</label>
            <input
              type="checkbox"
              id="soundEnabled"
              checked={soundEnabled}
              onChange={(e) => handleToggleSound(e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="soundVolume" className="font-semibold">音量: {Math.round(soundVolume * 100)}%</label>
            <input
              type="range"
              id="soundVolume"
              min="0"
              max="1"
              step="0.01"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="range range-primary w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {['click', 'correct', 'incorrect', 'achievement', 'gameStart', 'gameEnd'].map(soundName => (
              <button
                key={soundName}
                onClick={() => handlePlaySound(soundName)}
                className="btn btn-secondary btn-sm"
                disabled={!soundEnabled}
              >
                {soundName}
              </button>
            ))}
          </div>
        </div>

        {/* 调试日志 */}
        <div className="card p-6 space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">调试日志</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-40 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">暂无日志</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="btn btn-secondary btn-sm"
          >
            清除日志
          </button>
        </div>

        {/* 状态信息 */}
        <div className="card p-6 space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">当前状态</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>音乐开关:</strong> {musicEnabled ? '开启' : '关闭'}
            </div>
            <div>
              <strong>音效开关:</strong> {soundEnabled ? '开启' : '关闭'}
            </div>
            <div>
              <strong>音乐音量:</strong> {Math.round(musicVolume * 100)}%
            </div>
            <div>
              <strong>音效音量:</strong> {Math.round(soundVolume * 100)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/" className="btn btn-secondary">
          返回主页
        </a>
      </div>
    </div>
  );
} 