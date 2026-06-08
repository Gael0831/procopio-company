import Sidebar from '../components/Sidebar';

function MainLayout({ children }) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">

            <Sidebar />

            <main className="
                flex-1
                bg-gray-100
                dark:bg-gray-900
                p-4
                md:p-8
                overflow-x-hidden
            ">
                {children}
            </main>

        </div>
    );
}

export default MainLayout;