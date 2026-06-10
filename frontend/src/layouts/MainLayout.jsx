import Sidebar from '../components/Sidebar';

function MainLayout({ children }) {
    return (
        <div className="
            relative
            flex
            flex-col
            lg:flex-row
            min-h-screen
            overflow-hidden
            bg-[#020617]
        ">

            <div className="
            fixed inset-0
            bg-[url('/procopio-bg.png')]
            bg-cover
            bg-center
            opacity-[0.04]
            pointer-events-none
            "/>

            <div className="relative z-20">
                <Sidebar />
            </div>

            <main className="
                relative
                z-10
                flex-1
                min-h-screen
                p-4
                sm:p-6
                md:p-8
                lg:p-10
                overflow-x-hidden
            ">
                <div className="
                    w-full
                    max-w-[1600px]
                    mx-auto
                    animate-[fadeIn_.35s_ease-out]
                ">
                    {children}
                </div>
            </main>

        </div>
    );
}

export default MainLayout;