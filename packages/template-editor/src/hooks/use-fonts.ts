import { getFontsByAppId } from '@clab/firebase';
import type { Font } from '@clab/types';
import { loadFont } from '@clab/utils';
import { useEffect, useMemo, useState } from 'react';

// module-level cache (only lasts while app is in memory)
const fontCache: Record<string, Font[] | null> = {};

const APP_ID = 'RwNg97gBZD8XkAE1tMFt';

export function useFonts() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const currentAppFontCache = fontCache[APP_ID];
    if (currentAppFontCache) {
      setFonts(currentAppFontCache);
      return;
    }

    setLoading(true);

    const getAndLoadFonts = async () => {
      const fonts = await getFontsByAppId(APP_ID);
      await Promise.all(fonts.map((font) => loadFont(font)));

      fontCache[APP_ID] = fonts;
      setFonts(fonts);
    };

    getAndLoadFonts().finally(() => setLoading(false));
  }, []);

  const filteredFonts = useMemo(() => {
    const query = search.toLowerCase();

    return fonts
      .filter((font) => font.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [fonts, search]);

  return { fonts: filteredFonts, loading, search, setSearch };
}
