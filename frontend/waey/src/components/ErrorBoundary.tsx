import { Component, type ReactNode } from "react";
import { LanguageContext } from "@/contexts/useLanguage";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext;
  declare context: React.ContextType<typeof LanguageContext>;
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, info.componentStack);
  }

  isChunkLoadError(error: Error | null): boolean {
    if (!error) return false;
    const msg = error.message.toLowerCase();
    return (
      msg.includes("dynamically imported module") ||
      msg.includes("loading chunk") ||
      msg.includes("loading CSS chunk") ||
      msg.includes("failed to fetch")
    );
  }

  handleRetry = () => {
    if (this.isChunkLoadError(this.state.error)) {
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      const isChunkErr = this.isChunkLoadError(this.state.error);
      const t = this.context?.t ?? ((key: string) => key);

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4" dir="rtl">
          <div className="text-center max-w-md bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm">
            <div className="size-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold mb-2">
              {isChunkErr ? t('error.newUpdate') : t('error.unexpected')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {isChunkErr
                ? t('error.updateDesc')
                : this.state.error?.message || t('error.pageLoadError')}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="h-10 px-6 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
              >
                {t('error.reload')}
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="h-10 px-6 rounded-full bg-muted text-muted-foreground text-sm font-bold hover:bg-muted/80 transition-all"
              >
                {t('error.home')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

