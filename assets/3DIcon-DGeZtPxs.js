import{j as r,m as s}from"./index-BmsZsPIQ.js";function o({children:t,className:e=""}){return r.jsx(s.div,{whileHover:{rotateX:5,rotateY:-5,y:-8},transition:{type:"spring",stiffness:120},className:`
        rounded-3xl p-5
        bg-white/80 dark:bg-[#0f172a]/80
        backdrop-blur-xl
        border border-slate-200 dark:border-white/10
        shadow-xl
        hover:shadow-2xl hover:shadow-blue-500/10
        transition
        ${e}
      `,style:{transformStyle:"preserve-3d",perspective:"1000px"},children:t})}function i({icon:t,color:e}){return r.jsxs(s.div,{whileHover:{rotateX:10,rotateY:-10,scale:1.1},whileTap:{scale:.95},className:`
        w-14 h-14 flex items-center justify-center
        rounded-2xl text-xl text-white font-bold
        bg-gradient-to-br ${e}
        shadow-xl relative
      `,children:[r.jsx("div",{className:`absolute inset-0 blur-xl opacity-30 rounded-2xl bg-gradient-to-br ${e}`}),r.jsx("span",{className:"relative z-10 drop-shadow-md",children:t})]})}export{o as C,i as I};
