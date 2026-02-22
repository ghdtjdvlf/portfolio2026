import { CodeComparison } from './CodeComparison';
import './CodeSection.css';

const beforeCode = `// ❌ Before — prop drilling nightmare
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  return (
    <Layout user={user} theme={theme}>
      <Sidebar user={user} theme={theme} />
      <Main user={user} theme={theme}>
        <Profile
          user={user}
          setUser={setUser}
          theme={theme}
        />
      </Main>
    </Layout>
  );
}`;

const afterCode = `// ✅ After — clean Context + custom hook
const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  return (
    <AppContext.Provider value={{ user, setUser, theme }}>
      <Layout>
        <Sidebar />
        <Main>
          <Profile />
        </Main>
      </Layout>
    </AppContext.Provider>
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
