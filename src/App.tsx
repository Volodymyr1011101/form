import styles from './App.module.scss';
import { Form } from './components/From/Form';

const App = () => {
    return (
        <div className={`App ${styles.main}`}>
            <Form title="Personal info" />
        </div>
    );
};

export default App;
