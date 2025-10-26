import { useEffect, useRef, useState } from 'react';

export default function useCenteredObserver(): [React.RefObject<HTMLDivElement|null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      const centerY = window.innerHeight / 2;
      const isInCenter = rect.top < centerY && rect.bottom > centerY;
      setIsCentered(isInCenter);
    };

    handleScroll(); // check on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return [ref, isCentered];
}
