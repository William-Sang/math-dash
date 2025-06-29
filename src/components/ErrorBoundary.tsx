import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('游戏错误:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
          <div className="card p-8 text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold mb-4">游戏出现错误</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              抱歉，游戏遇到了一个意外错误。请刷新页面重新开始。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-lg"
            >
              刷新页面
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  错误详情 (开发模式)
                </summary>
                <pre className="mt-2 text-xs bg-gray-800 text-white p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 