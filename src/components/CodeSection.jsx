import { CodeComparison } from './CodeComparison';

const beforeCode = `// ❌ Before — prop drilling nightmare
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  return ( // [!code focus]
    <Layout user={user} theme={theme}> // [!code focus]
      <Sidebar user={user} theme={theme} /> // [!code focus]
      <Main user={user} theme={theme}> // [!code focus]
        <Profile // [!code focus]
          user={user} // [!code focus]
          setUser={setUser} // [!code focus]
          theme={theme} // [!code focus]
        /> // [!code focus]
      </Main> // [!code focus]
    </Layout> // [!code focus]
  ); // [!code focus]
}`;

const afterCode = `// ✅ After — clean Context + custom hook
const AppContext = createContext(null); // [!code focus]

export function useApp() { // [!code focus]
  return useContext(AppContext); // [!code focus]
} // [!code focus]

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  return (
    <AppContext.Provider value={{ user, setUser, theme }}> // [!code focus]
      <Layout> // [!code focus]
        <Sidebar /> // [!code focus]
        <Main> // [!code focus]
          <Profile /> // [!code focus]
        </Main> // [!code focus]
      </Layout> // [!code focus]
    </AppContext.Provider> // [!code focus]
  );
}`;

const CodeSection = () => {
  return (
    <section
      id="code"
      className="relative w-full min-h-screen bg-background flex items-center justify-center py-32 px-6
                 before:absolute before:top-0 before:left-[10%] before:w-4/5 before:h-px
                 before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent"
    >
      <div className="max-w-[900px] w-full flex flex-col gap-8">

        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-zinc-600">
          Code Philosophy
        </p>

        <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[1.1] tracking-tight text-zinc-50 m-0">
          Writing code that<br />
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            speaks for itself
          </span>
        </h2>

        <p className="text-base leading-7 text-zinc-600 mb-2">
          Clean architecture over clever tricks. Every refactor tells a story.
        </p>

        <CodeComparison
          beforeCode={beforeCode}
          afterCode={afterCode}
          language="jsx"
          filename="App.jsx"
          highlightColor="#7c3aed"
        />

      </div>
    </section>
  );
};

export default CodeSection;
