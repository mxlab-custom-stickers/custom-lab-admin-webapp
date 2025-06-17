import { useAppContext } from '@/contexts/app-context.ts';
import { getFontsByAppId } from '@/lib/firebase/firestore.ts';
import { loadFont } from '@/lib/fonts.ts';
import { Font } from '@/models/text.ts';
import { useEffect, useMemo, useState } from 'react';

// module-level cache (only lasts while app is in memory)
let fontCache: Record<string, Font[] | null> = {};

export function useFonts() {
  const { currentApp } = useAppContext();

  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (!currentApp) return;

    const currentAppFontCache = fontCache[currentApp.id];
    if (currentAppFontCache) {
      setFonts(currentAppFontCache);
      return;
    }

    setLoading(true);

    const getAndLoadFonts = async () => {
      const fonts = await getFontsByAppId(currentApp.id);
      await Promise.all(fonts.map((font) => loadFont(font)));

      fontCache[currentApp.id] = fonts;
      setFonts(fonts);
    };

    getAndLoadFonts().finally(() => setLoading(false));
  }, [currentApp.id]);

  const filteredFonts = useMemo(() => {
    const query = search.toLowerCase();

    return fonts
      .filter((font) => font.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [fonts, search]);

  return { fonts: filteredFonts, loading, search, setSearch };
}
