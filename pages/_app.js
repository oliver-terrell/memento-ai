import 'styles/tailwind.css';

export default function App({ Component, pageProps }) {
    return <div className={`min-h-screen bg-gray-100`}>
        <Component {...pageProps} />
    </div>
};
