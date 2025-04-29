import { useEffect, useRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    const portalRoot = document.body;
    portalRoot.appendChild(elRef.current!);
    setMounted(true);
    return () => {
      portalRoot.removeChild(elRef.current!);
    };
  }, []);

  return mounted ? createPortal(children, elRef.current!) : null;
} 