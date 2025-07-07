// プログレスイベント用のシンプルなイベントエミッター
type ProgressListener = (message: string) => void;

class ProgressEmitter {
  private listeners: ProgressListener[] = [];

  on(listener: ProgressListener) {
    this.listeners.push(listener);
  }

  off(listener: ProgressListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  emit(message: string) {
    this.listeners.forEach(listener => listener(message));
  }
}

export const progressEmitter = new ProgressEmitter();