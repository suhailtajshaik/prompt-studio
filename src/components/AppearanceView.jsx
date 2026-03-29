import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Sun, Moon } from 'lucide-react';
import { THEMES, THEME_FAMILIES, DARK_PAIRS, getTheme } from '../data/themes';

// Mini card preview — shows a tiny mock of the app UI in each theme's colors
function ThemePreviewCard({ theme, isSelected, onSelect, label }) {
  const c = theme.colors;
  const gradStyle = {
    background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`,
  };

  return (
    <motion.button
      onClick={() => onSelect(theme.id)}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        background: c.surf,
        borderColor: isSelected ? c.acc : c.bord,
        boxShadow: isSelected
          ? `0 0 0 2px ${c.acc}55, 0 8px 24px ${c.acc}20`
          : '0 2px 8px rgba(0,0,0,0.12)',
      }}
      className="relative rounded-2xl border-2 overflow-hidden text-left transition-all duration-200 cursor-pointer w-full"
    >
      {/* Mini UI mockup */}
      <div style={{ background: c.bg, padding: '10px 10px 0' }}>
        {/* Topbar */}
        <div
          style={{
            background: c.surf,
            borderColor: c.bord,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 6,
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 3, ...gradStyle }} />
            <div style={{ width: 30, height: 4, borderRadius: 2, background: c.text, opacity: 0.5 }} />
          </div>
          <div style={{ width: 22, height: 4, borderRadius: 2, ...gradStyle, opacity: 0.7 }} />
        </div>

        {/* Input area */}
        <div
          style={{
            background: c.inBg,
            border: `1px solid ${c.inBord}`,
            borderRadius: 6,
            padding: '5px 6px',
            marginBottom: 5,
          }}
        >
          <div style={{ width: '65%', height: 3, borderRadius: 2, background: c.textSub, opacity: 0.4, marginBottom: 3 }} />
          <div style={{ width: '40%', height: 3, borderRadius: 2, background: c.textSub, opacity: 0.25 }} />
        </div>

        {/* Output area with token chips */}
        <div
          style={{
            background: c.outBg,
            border: `1px solid ${c.outBord}`,
            borderRadius: 6,
            padding: '5px 6px',
            marginBottom: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {(c.tokens || []).slice(0, 5).map((tok, i) => (
              <div
                key={i}
                style={{
                  background: tok.bg,
                  color: tok.tx,
                  borderRadius: 3,
                  padding: '1px 4px',
                  fontSize: 6,
                  fontWeight: 600,
                  lineHeight: '10px',
                }}
              >
                ◼
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Swatch row */}
      <div style={{ display: 'flex', height: 5 }}>
        {(c.swatches || []).map((sw, i) => (
          <div key={i} style={{ flex: 1, background: sw }} />
        ))}
      </div>

      {/* Theme mode label */}
      <div style={{ background: c.surf, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
        {theme.dark ? (
          <Moon size={10} style={{ color: c.textSub }} />
        ) : (
          <Sun size={10} style={{ color: c.textSub }} />
        )}
        <span style={{ color: c.text, fontSize: 11, fontWeight: 600 }}>
          {label || (theme.dark ? 'Dark' : 'Light')}
        </span>
      </div>

      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: c.acc,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={10} color={theme.dark ? '#000' : '#fff'} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function AppearanceView({ themeId, onThemeChange }) {
  const selectedTheme = getTheme(themeId);
  const selectedFamily = selectedTheme.family;

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${selectedTheme.colors.grad[0]}, ${selectedTheme.colors.grad[1]})` }}
        >
          <Palette size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-text tracking-tight uppercase" style={{ letterSpacing: '0.08em' }}>
            Select Theme
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Choose a look that fits your workflow and style. Each theme has light &amp; dark modes.
          </p>
        </div>
      </div>

      {/* Theme families — each family shows light + dark side by side */}
      <div className="space-y-6">
        {THEME_FAMILIES.map((familyId) => {
          const lightTheme = THEMES.find((t) => t.id === familyId);
          const darkTheme = THEMES.find((t) => t.id === DARK_PAIRS[familyId]);
          if (!lightTheme || !darkTheme) return null;

          const isFamilySelected = selectedFamily === familyId;

          return (
            <div key={familyId}>
              {/* Family header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: lightTheme.colors.acc }}
                />
                <h3 className="text-sm font-bold text-text">{lightTheme.name}</h3>
                <span className="text-xs text-text-secondary">— {lightTheme.vibe.split('·').slice(1).join('·').trim()}</span>
                {isFamilySelected && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: lightTheme.colors.accLight,
                      color: lightTheme.colors.acc,
                    }}
                  >
                    Active
                  </motion.span>
                )}
              </div>

              {/* Light + Dark cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-md">
                <ThemePreviewCard
                  theme={lightTheme}
                  isSelected={themeId === lightTheme.id}
                  onSelect={onThemeChange}
                  label="Light"
                />
                <ThemePreviewCard
                  theme={darkTheme}
                  isSelected={themeId === darkTheme.id}
                  onSelect={onThemeChange}
                  label="Dark"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer status bar */}
      <div
        className="flex items-center justify-between rounded-2xl px-5 py-3.5 border"
        style={{
          background: selectedTheme.colors.surf,
          borderColor: selectedTheme.colors.bord,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: selectedTheme.colors.acc }}
          />
          <span className="text-sm font-medium text-text">
            Selected: <span className="font-bold">{selectedTheme.name}</span>
          </span>
          <span className="text-xs text-text-secondary">
            {selectedTheme.dark ? '🌙 Dark' : '☀️ Light'} — {selectedTheme.vibe}
          </span>
        </div>
        <motion.button
          onClick={() => onThemeChange(themeId)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.colors.grad[0]}, ${selectedTheme.colors.grad[1]})`,
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-md"
        >
          <Check size={14} />
          Applied
        </motion.button>
      </div>
    </div>
  );
}
