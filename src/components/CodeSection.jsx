import { CodeComparison } from './CodeComparison';
import './CodeSection.css';

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
    <section className="code-section" id="code">
      <div className="code-section__inner">

        <p className="code-section__label">Code Philosophy</p>

        <h2 className="code-section__headline">
          Writing code that<br />
          <span className="code-section__headline--accent">speaks for itself</span>
        </h2>

        <p className="code-section__desc">
          Clean architecture over clever tricks. Every refactor tells a story.
        </p>

        <CodeComparison
          beforeCode={beforeCode}
          afterCode={afterCode}
          language="jsx"
          filename="App.jsx"
          highlightColor="rgba(124, 58, 237, 0.25)"
        />

      </div>
    </section>
  );
};

export default CodeSection;
