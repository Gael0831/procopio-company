import Sidebar from '../components/Sidebar';

function MainLayout({ children }) {
    return (
        <div className="flex flex-col md:flex-row">

            <Sidebar />

            <div className="
                flex-1
                min-h-screen
                p-4
                md:p-8
                bg-gray-100
                dark:bg-gray-900
                transition-all
                duration-500
                overflow-x-auto
            ">
                {children}
            </div>

        </div>
    )
}

export default MainLayout;