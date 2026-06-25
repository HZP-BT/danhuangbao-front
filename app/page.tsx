export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home?populate=*`, {
    cache: 'no-store'
  });
  const json = await res.json();
  
  // 【关键修复点】：智能兼容 Strapi 的新老数据结构，没有 attributes 也能读！
  const data = json?.data?.attributes || json?.data;

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">数据解析失败，请检查后端。</div>;
  }

  const { MainTitle, SubTitle, ButtonText, Announcement, BackgroundImage, BannerVideo } = data;

  // 【关键修复点】：智能读取背景图。优先读 BackgroundImage，如果没有就读 BannerVideo
  let bgUrl = '';
  const mediaObj = BackgroundImage || BannerVideo;
  const rawUrl = mediaObj?.data?.attributes?.url || mediaObj?.url;

  if (rawUrl) {
    bgUrl = rawUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${rawUrl}` : rawUrl;
  }

  // 解析公告栏富文本
  let announcementText = "";
  if (Array.isArray(Announcement) && Announcement.length > 0) {
    announcementText = Announcement[0]?.children?.[0]?.text || "";
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950">
      
      {bgUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      )}

      <div className="relative z-10 p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.15)] text-center max-w-lg w-full mx-4 overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-3xl" />

        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 filter drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
          {MainTitle || '等待数据接入'}
        </h1>
        
        <p className="text-gray-300 text-xl mb-8 tracking-widest font-light">
          {SubTitle || '...'}
        </p>

        {ButtonText && (
          <button className="px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-full text-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] tracking-wider font-bold mb-8">
            {ButtonText}
          </button>
        )}

        {announcementText && (
          <div className="mt-4 p-5 bg-black/40 rounded-xl border border-gray-700/50 text-sm text-gray-300 text-left backdrop-blur-md">
            <div className="flex items-center mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" />
              <h3 className="text-cyan-400 font-bold">终端通讯接通</h3>
            </div>
            <p className="leading-relaxed">{announcementText}</p>
          </div>
        )}
      </div>
    </main>
  );
}
