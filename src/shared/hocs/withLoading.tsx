import type { ComponentType } from 'react';
import { Spinner } from '../components/Spinner';

export function withLoading<P extends object>(
  Component: ComponentType<P>
): ComponentType<P & { isLoading: boolean }> {
  return function WithLoadingWrapper({
    isLoading,
    ...props
  }: P & { isLoading: boolean }): React.ReactElement {
    if (isLoading) return <Spinner />;
    return <Component {...(props as P)} />;
  };
}