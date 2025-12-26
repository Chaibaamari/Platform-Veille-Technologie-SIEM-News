// Hero Section <img src="/SIEM_frontend/public/images/Abstract Design.svg" alt=""  className='w-3xs bg-amber-600'/>
const Hero = () => {
    return (
        <section className="relative h-screen flex flex-col justify-center px-40 bg-linear-to-b from-slate-950 to-zinc-900">
            <div>
                <div className="max-w-5xl">
                    <h1 className="text-8xl font-medium leading-26 text-white">
                        Your Journey to Tomorrow <br />
                        <span className="text-violet-500">Begins Here</span>
                    </h1>
                    <p className="mt-8 text-neutral-400 text-lg max-w-3xl">
                        Welcome to the epicenter of AI innovation. FutureTech AI News is your passport to a world where machines think, learn, and reshape the future.
                    </p>
                </div>

                {/* Stats */}
                <div className="absolute bottom-20 left-40 flex gap-20">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-semibold text-white">300<span className="text-violet-500">+</span></div>
                        <div className="text-neutral-400">Resources available</div>
                    </div>
                    <div className="w-px bg-neutral-800" />
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-semibold text-white">12k<span className="text-violet-500">+</span></div>
                        <div className="text-neutral-400">Total Downloads</div>
                    </div>
                    <div className="w-px bg-neutral-800" />
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-semibold text-white">10k<span className="text-violet-500">+</span></div>
                        <div className="text-neutral-400">Active Users</div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/images/Abstract%20Design.svg"
                    alt="Abstract futuristic design"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-[120%] w-auto max-w-none 
                    opacity-80 
                    blur-sm 
                    filter drop-shadow-2xl"
                    style={{
                        maskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 90%, transparent 100%)'
                    }}
                />
            </div>
        </section>
    );
};

export default Hero;