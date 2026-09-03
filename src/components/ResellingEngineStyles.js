/* Reselling Engine visual styling, verbatim. Scoped entirely under the
   .desk wrapper class, so it is safe to import and render this string
   from anywhere as long as it stays inside a .desk container. */
export const resellingEngineStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');

        @keyframes riseIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{0%{opacity:0;transform:scale(.82)}62%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
        @keyframes sheen{0%{transform:translateX(-140%) skewX(-18deg)}100%{transform:translateX(260%) skewX(-18deg)}}
        @keyframes barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes emberPulse{0%,100%{box-shadow:0 0 0 0 rgba(194,27,60,.5)}55%{box-shadow:0 0 0 7px rgba(194,27,60,0)}}
        @keyframes tickIn{0%{opacity:0;transform:translateY(14px) scale(.985)}100%{opacity:1;transform:none}}
        @keyframes numIn{0%{opacity:0;letter-spacing:.06em}100%{opacity:1;letter-spacing:-.04em}}

        .desk{--ground:#0A0708;--panel:#141011;--ink:#F2EAEB;--muted:#9C8A8D;--rule:#2E2427;
          --go:#3FA277;--warn:#D6A03C;--stop:#E04B36;--soft:#241C1E;
          --crimson:#8E1024;--crimson-hi:#C21B3C;--tag:#7C0E20;--tagink:#EBBFC7;--tagrule:#A6182F;
          background:radial-gradient(1100px 420px at 10% -12%,rgba(142,16,36,.30),transparent 62%),var(--ground);
          color:var(--ink);min-height:100%;padding:18px 14px 44px;
          font-family:'Archivo',system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;
          line-height:1.45;font-variant-numeric:tabular-nums;animation:fadeIn .4s ease both;}
        .desk *{box-sizing:border-box;}
        .desk ::selection{background:rgba(194,27,60,.45);color:#fff;}
        .wrap{max-width:1060px;margin:0 auto;}
        h1{font-size:27px;font-weight:800;letter-spacing:-.025em;margin:0 0 3px;
          animation:riseIn .5s cubic-bezier(.2,.8,.2,1) both;}
        .sub{color:var(--muted);font-size:14px;margin:0 0 16px;max-width:62ch;
          animation:riseIn .5s cubic-bezier(.2,.8,.2,1) .06s both;}
        h2{font-size:15px;font-weight:700;margin:0 0 10px;letter-spacing:-.01em;}
        h3{font-size:14.5px;font-weight:700;margin:0 0 6px;}
        .panel{background:var(--panel);border:1px solid var(--rule);border-radius:5px;padding:16px;margin-bottom:14px;
          transition:border-color .25s ease,box-shadow .25s ease;
          animation:riseIn .48s cubic-bezier(.2,.8,.2,1) both;}
        .panel:nth-of-type(2){animation-delay:.05s}
        .panel:nth-of-type(3){animation-delay:.1s}
        .panel:nth-of-type(4){animation-delay:.15s}
        .panel:nth-of-type(5){animation-delay:.2s}
        .panel:hover{border-color:#4A3237;box-shadow:0 0 0 1px rgba(194,27,60,.10),0 10px 30px -18px rgba(0,0,0,.9);}
        .chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
        .chip{border:1px solid var(--rule);background:var(--panel);color:var(--muted);border-radius:20px;
          padding:6px 13px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;
          transition:background .2s ease,color .2s ease,border-color .2s ease,transform .12s ease;}
        .chip:hover{color:var(--ink);border-color:var(--crimson);transform:translateY(-1px);}
        .chip:active{transform:translateY(0);}
        .chip[aria-pressed="true"]{background:var(--crimson);color:#FDECEF;border-color:var(--crimson-hi);font-weight:600;}
        .chip:focus-visible,.btn:focus-visible,input:focus-visible,select:focus-visible,.tab:focus-visible{outline:2px solid var(--crimson-hi);outline-offset:2px;}
        .ticket{position:relative;overflow:hidden;border:1px solid var(--tagrule);border-radius:5px;
          background:linear-gradient(135deg,#8A1024 0%,#5B0A17 55%,#340509 100%);
          padding:20px 20px 18px 42px;margin-bottom:14px;
          box-shadow:0 18px 40px -26px rgba(194,27,60,.85);
          animation:tickIn .55s cubic-bezier(.2,.8,.2,1) both;}
        .ticket::after{content:"";position:absolute;inset:0;pointer-events:none;width:38%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);
          animation:sheen 1.5s cubic-bezier(.4,0,.2,1) .5s 1 both;}
        .punch{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:14px;height:14px;
          border-radius:50%;background:var(--ground);border:1px solid var(--tagrule);}
        .tick-label{font-size:13px;font-weight:600;color:var(--tagink);margin:0;}
        .tick-num{font-size:46px;font-weight:800;letter-spacing:-.04em;line-height:1.02;margin:2px 0 4px;
          color:#FFF2F4;text-shadow:0 2px 18px rgba(194,27,60,.5);
          animation:numIn .6s cubic-bezier(.2,.8,.2,1) .15s both;}
        .tick-note{font-size:13px;color:var(--tagink);margin:0;max-width:44ch;}
        .tick-v{position:absolute;right:16px;top:14px;text-align:right;}
        .tick-v b{display:block;font-size:19px;font-weight:800;letter-spacing:-.02em;}
        .tick-v span{font-size:12.5px;color:var(--tagink);}
        .grid2{display:grid;grid-template-columns:1fr;gap:14px;}
        @media(min-width:900px){.grid2{grid-template-columns:1fr 1fr;}}
        .field{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid var(--soft);}
        .field:last-child{border-bottom:0;}
        .field label{font-size:14px;}
        .field small{display:block;color:var(--muted);font-size:12.5px;}
        input,select{font-family:inherit;font-size:14.5px;color:var(--ink);background:#1B1517;
          border:1px solid var(--rule);border-radius:4px;padding:7px 9px;width:112px;text-align:right;
          font-variant-numeric:tabular-nums;
          transition:border-color .2s ease,box-shadow .2s ease,background .2s ease;}
        input::placeholder{color:#6B5A5D;}
        input:hover,select:hover{border-color:#4A3237;}
        input:focus,select:focus{border-color:var(--crimson-hi);background:#211A1C;
          box-shadow:0 0 0 3px rgba(194,27,60,.18);}
        select{text-align:left;width:100%;max-width:200px;}
        select option{background:#1B1517;color:var(--ink);}
        .full input{width:100%;text-align:left;margin-top:5px;}
        .stats{display:grid;grid-template-columns:1fr 1fr;}
        .stat{padding:9px 0;border-bottom:1px solid var(--soft);animation:fadeIn .45s ease both;}
        .stat:nth-child(odd){padding-right:12px;}
        .stat b{display:block;font-size:20px;font-weight:700;letter-spacing:-.02em;}
        .stat span{font-size:12.5px;color:var(--muted);}
        .feeline{display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--muted);
          animation:fadeIn .4s ease both;}
        .feeline b{color:var(--ink);font-weight:600;}
        .bar{height:6px;background:var(--soft);border-radius:3px;overflow:hidden;margin-top:5px;}
        .bar i{display:block;height:100%;transform-origin:left center;
          background:linear-gradient(90deg,var(--crimson) 0%,var(--crimson-hi) 100%);
          box-shadow:0 0 12px rgba(194,27,60,.55);
          transition:width .5s cubic-bezier(.2,.8,.2,1);
          animation:barGrow .65s cubic-bezier(.2,.8,.2,1) both;}
        .srow{padding:8px 0;border-bottom:1px solid var(--soft);}
        .srow:last-child{border-bottom:0;}
        .srow-top{display:flex;justify-content:space-between;gap:12px;font-size:14px;}
        .srow-top em{font-style:normal;color:var(--muted);font-size:13px;}
        .check{display:flex;gap:9px;padding:8px 0;border-bottom:1px solid var(--soft);align-items:flex-start;
          animation:fadeIn .4s ease both;}
        .check:last-child{border-bottom:0;}
        .dot{width:9px;height:9px;border-radius:50%;margin-top:6px;flex:none;
          animation:popIn .34s cubic-bezier(.2,.8,.2,1) both;}
        .check p{margin:0;font-size:14px;}
        .check small{color:var(--muted);font-size:12.5px;}
        .btn{font-family:inherit;font-size:14.5px;font-weight:600;border-radius:4px;padding:9px 15px;
          cursor:pointer;border:1px solid var(--crimson-hi);background:var(--crimson);color:#FDECEF;
          transition:background .2s ease,transform .12s ease,box-shadow .2s ease,border-color .2s ease;}
        .btn:hover:not(:disabled){background:var(--crimson-hi);transform:translateY(-1px);
          box-shadow:0 10px 24px -14px rgba(194,27,60,1);}
        .btn:active:not(:disabled){transform:translateY(0);box-shadow:none;}
        .btn.ghost{background:transparent;color:var(--ink);border-color:var(--rule);}
        .btn.ghost:hover:not(:disabled){border-color:var(--crimson-hi);color:#FFD9DF;background:rgba(142,16,36,.14);}
        .btn:disabled{opacity:.4;cursor:default;}
        .btnrow{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
        .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
        .tab{border:1px solid var(--rule);background:var(--panel);border-radius:4px;padding:8px 14px;
          font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;color:var(--muted);
          transition:background .2s ease,color .2s ease,border-color .2s ease,transform .12s ease;}
        .tab:hover{color:var(--ink);border-color:var(--crimson);transform:translateY(-1px);}
        .tab[aria-selected="true"]{background:var(--crimson);color:#FDECEF;border-color:var(--crimson-hi);
          box-shadow:0 8px 22px -16px rgba(194,27,60,1);}
        .comp-chip{display:inline-flex;align-items:center;gap:6px;background:#1E1719;border:1px solid var(--rule);
          border-radius:4px;padding:4px 8px;font-size:13.5px;margin:0 5px 5px 0;
          transition:border-color .2s ease,background .2s ease;
          animation:popIn .3s cubic-bezier(.2,.8,.2,1) both;}
        .comp-chip:hover{border-color:var(--crimson);background:#241A1D;}
        .comp-chip button{border:0;background:none;cursor:pointer;color:var(--muted);font-size:15px;line-height:1;padding:0;
          transition:color .18s ease;}
        .comp-chip button:hover{color:var(--crimson-hi);}
        .flag{display:inline-block;font-size:12px;font-weight:600;padding:1px 7px;border-radius:3px;color:#fff;
          animation:emberPulse 2.6s ease-out 1s infinite;}
        .note{font-size:13.5px;color:var(--muted);margin:8px 0 0;}
        .card{border-left:3px solid var(--rule);padding:2px 0 2px 12px;margin-bottom:16px;
          transition:border-color .2s ease;animation:riseIn .42s cubic-bezier(.2,.8,.2,1) both;}
        .card.go{border-color:var(--go);} .card.warn{border-color:var(--warn);} .card.stop{border-color:var(--stop);}
        .card p{margin:0 0 6px;font-size:14px;}
        .rule{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--soft);}
        .rule:last-child{border-bottom:0;}
        .rule small{display:block;color:var(--muted);font-size:12.5px;}
        .logrow{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--soft);font-size:14px;align-items:center;
          transition:background .2s ease;animation:fadeIn .4s ease both;}
        .logrow:hover{background:rgba(142,16,36,.10);}
        .logrow:last-child{border-bottom:0;}
        .x{border:0;background:none;color:var(--muted);cursor:pointer;font-size:15px;padding:0 2px;
          transition:color .18s ease,transform .18s ease;}
        .x:hover{color:var(--crimson-hi);transform:scale(1.2);}
        table{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px;}
        th,td{text-align:right;padding:5px 4px;border-bottom:1px solid var(--soft);}
        th:first-child,td:first-child{text-align:left;}
        th{color:var(--muted);font-weight:600;}
        tbody tr{transition:background .18s ease;}
        tbody tr:hover{background:rgba(142,16,36,.10);}
        .switch{display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;padding:7px 0;}
        .switch input{accent-color:var(--crimson-hi);}
        ul{margin:6px 0 0;padding-left:17px;}
        li::marker{color:var(--crimson-hi);}
        @media (prefers-reduced-motion:reduce){
          .desk *,.desk *::after,.desk *::before{animation:none!important;transition:none!important;}
        }
      `;
