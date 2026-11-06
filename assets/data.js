/* Michael's Journey — local demonstration content and browser storage. */
window.Journey = (() => {
  const categories=['Home & essentials','Education','Health & care','Livelihood'];
  const records=[
    ['A little comfort for the Santos family','Santos family','Laguna, Luzon','Luzon','Home & essentials','family','Help a family find steadier days, with food on the table and everyday essentials.'],
    ['A fresh start, one small home at a time','Reyes family','Bohol, Visayas','Visayas','Home & essentials','home','A safer home can give a family the space to rest, rebuild, and begin again.'],
    ['Keeping a small harvest full of hope','Dela Cruz family','Benguet, Luzon','Luzon','Livelihood','harvest','Support the everyday tools and supplies that help a farming family keep going.'],
    ['Room for learning, room for dreams','Garcia family','Cebu, Visayas','Visayas','Education','children','School supplies and daily transport can help keep a child’s dreams within reach.'],
    ['A helping hand for days by the sea','Ramos family','Palawan, Luzon','Luzon','Livelihood','coast','Give a fishing household a little breathing room as they work toward a steadier income.'],
    ['Care, comfort, and a little less worry','Mendoza family','Davao, Mindanao','Mindanao','Health & care','family','A little support can ease the cost of getting to appointments and meeting everyday needs.'],
    ['Small steps toward a brighter school year','Villanueva family','Iloilo, Visayas','Visayas','Education','community','Help a family prepare notebooks, school clothes, and essentials for another year of learning.'],
    ['A warm meal and a gentler tomorrow','Torres family','Quezon, Luzon','Luzon','Home & essentials','home','Everyday groceries can make room for a family to focus on the next step forward.'],
    ['Helping hands for a hillside harvest','Navarro family','Ifugao, Luzon','Luzon','Livelihood','terraces','Practical help with seeds and supplies can support a season of patient work.'],
    ['A little care goes a long way','Castillo family','Bukidnon, Mindanao','Mindanao','Health & care','family','Support a household with the small daily expenses that can become a heavy burden.'],
    ['Keeping dreams afloat','Flores family','Samar, Visayas','Visayas','Livelihood','boat','A family by the coast looks toward brighter days with tools for their daily work.'],
    ['A space to grow, a reason to smile','Aquino family','Batangas, Luzon','Luzon','Home & essentials','home','A small act of kindness can help make a family’s everyday surroundings more comfortable.'],
    ['Opening another door to learning','Bautista family','Leyte, Visayas','Visayas','Education','children','Help make school days easier with learning materials and transport essentials.'],
    ['Hope between the hills','Pascual family','Nueva Ecija, Luzon','Luzon','Livelihood','harvest','Stand beside a hardworking household as they prepare for the next planting season.'],
    ['One less worry for the Lim family','Lim family','Cagayan de Oro, Mindanao','Mindanao','Health & care','family','Help with the practical needs that let a family concentrate on caring for one another.'],
    ['A safer place to come home to','Domingo family','Albay, Luzon','Luzon','Home & essentials','home','Support basic home repairs and the everyday comforts a family deserves.'],
    ['More possibilities, one notebook at a time','Santiago family','Negros, Visayas','Visayas','Education','community','Small learning essentials can become the beginning of something much bigger.'],
    ['A kind gesture for a coastal family','Mercado family','Surigao, Mindanao','Mindanao','Livelihood','coast','Help a coastal household meet immediate needs while they continue their daily work.'],
    ['Finding steadier ground together','Soriano family','Pangasinan, Luzon','Luzon','Home & essentials','home','A helping hand with food and household necessities can make a difficult week gentler.'],
    ['Care that feels a little closer','Valdez family','Zamboanga, Mindanao','Mindanao','Health & care','family','Practical support can help a family reach the services and essentials they need.'],
    ['Little dreams in a big world','Gutierrez family','Aklan, Visayas','Visayas','Education','children','Help a household give their children a more comfortable start to the school day.'],
    ['Another season of possibility','Rivera family','Isabela, Luzon','Luzon','Livelihood','terraces','Basic farming supplies can help a family continue the work they know and love.'],
    ['Bringing a little ease to everyday life','Chua family','General Santos, Mindanao','Mindanao','Home & essentials','gathering','Simple necessities can bring a household a little comfort and room to breathe.'],
    ['A new chapter for a family by the water','Fernandez family','Bohol, Visayas','Visayas','Livelihood','boat','A little support for daily needs can help a family look forward with renewed hope.']
  ];
  const makePhoto=(name)=>({id:`stock-${name}`,kind:'image',src:`assets/images/${name==='community'?'children':name}.jpg`,name:'Illustrative photograph — Pexels'});
  const seed=records.map((r,i)=>({id:`family-${String(i+1).padStart(2,'0')}`,title:r[0],family:r[1],location:r[2],region:r[3],category:r[4],summary:r[6],story:`${r[6]}\n\nThis is a fictional sample story, included to show how a family’s journey will be shared on Michael’s Journey. The people in the illustrative photographs are not the people described here.\n\nIn a real Exhibit, this space will introduce the family in their own words, describe the challenges they have chosen to share, and explain the practical support they need. Their story, photographs, and payment details will be shared only with their permission.\n\nA kind gesture can help with everyday essentials and make the next step feel a little more possible. When this sample is replaced with a real story, supporters will be able to give directly through the payment methods provided by the family.\n\nThank you for taking a moment to listen. Every act of kindness begins with seeing the person behind the story.`,status:'published',sample:true,consent:false,createdAt:new Date(Date.UTC(2026,9,30)-i*86400000).toISOString(),updatedAt:new Date(Date.UTC(2026,9,30)-i*86400000).toISOString(),media:[makePhoto(r[5]),makePhoto(i%2?'terraces':'home')],payments:{qrLabel:'GCash',qr:null,bank:'',accountName:'',accountNumber:'',otherLabel:'',otherDetails:'',otherUrl:''}}));
  let dbPromise,storageOK=true;const urls=new Map();
  const waitTx=tx=>new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Storage could not be updated.'));tx.onabort=()=>reject(tx.error||new Error('Storage update was interrupted.'));});
  const req=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  async function open(){
    if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
      const r=indexedDB.open('michaels-journey-demo',1);
      r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore('posts',{keyPath:'id'});d.createObjectStore('media',{keyPath:'id'});d.createObjectStore('meta');};
      r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Please close other older demo tabs, then reload.'));
      r.onsuccess=()=>{const d=r.result;const tx=d.transaction(['posts','meta'],'readwrite');const initialized=tx.objectStore('meta').get('initialized');initialized.onsuccess=()=>{if(!initialized.result){seed.forEach(p=>tx.objectStore('posts').put(p));tx.objectStore('meta').put(true,'initialized');}};waitTx(tx).then(()=>resolve(d),reject);};
    }).catch(error=>{storageOK=false;console.warn('Demo storage unavailable:',error.message);return null;});
    return dbPromise;
  }
  async function all(){const d=await open();if(!d)return structuredClone(seed);return req(d.transaction('posts').objectStore('posts').getAll());}
  async function get(id){const list=await all();return list.find(p=>p.id===id);}
  async function save(post,files=[]){const d=await open();if(!d)throw new Error('Browser storage is unavailable. Open START-WEBSITE.cmd and allow local browser storage.');const tx=d.transaction(['posts','media'],'readwrite');files.forEach(f=>tx.objectStore('media').put(f));tx.objectStore('posts').put(post);await waitTx(tx);}
  async function remove(id){const d=await open();if(!d)throw new Error('Browser storage is unavailable.');const tx=d.transaction(['posts','media'],'readwrite');const store=tx.objectStore('posts');const r=store.get(id);r.onsuccess=()=>{const p=r.result;if(p){[...(p.media||[]),p.payments?.qr].filter(Boolean).forEach(m=>{if(!m.src)tx.objectStore('media').delete(m.id);});store.delete(id);}};await waitTx(tx);}
  async function source(media){if(!media)return '';if(media.src){return /^(assets\/images\/[a-z-]+\.jpg|https:\/\/)/.test(media.src)?media.src:'';}if(urls.has(media.id))return urls.get(media.id);const d=await open();if(!d)return '';const item=await req(d.transaction('media').objectStore('media').get(media.id));if(!item)return '';const url=URL.createObjectURL(item.blob);urls.set(media.id,url);return url;}
  function published(list){return list.filter(p=>p.status==='published').sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
  async function exportData(){const d=await open();if(!d)throw new Error('Browser storage is unavailable.');const posts=await all();const media=await req(d.transaction('media').objectStore('media').getAll());const used=new Set(posts.flatMap(p=>[...p.media,p.payments?.qr].filter(Boolean).filter(m=>!m.src).map(m=>m.id)));const items=await Promise.all(media.filter(m=>used.has(m.id)).map(m=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({id:m.id,type:m.blob.type,data:reader.result});reader.onerror=reject;reader.readAsDataURL(m.blob);})));return {format:'michaels-journey',version:1,exportedAt:new Date().toISOString(),posts,media:items};}
  function validatePost(p){
    if(!p||typeof p.id!=='string'||!/^[a-zA-Z0-9-]{1,100}$/.test(p.id))throw new Error('The backup contains an invalid story ID.');
    const limits={title:120,family:100,location:120,region:30,category:50,summary:300,story:20000};
    for(const [key,max]of Object.entries(limits)){if(typeof p[key]!=='string'||p[key].length>max)throw new Error(`Invalid ${key} in the backup.`);}
    if(!['draft','published'].includes(p.status)||!Array.isArray(p.media)||p.media.length>25||!p.payments)throw new Error('The backup contains an invalid story.');
    for(const m of [...p.media,p.payments.qr].filter(Boolean)){
      if(typeof m.id!=='string'||!['image','video','youtube'].includes(m.kind))throw new Error('Invalid media in backup.');
      if(m.kind==='youtube'&&!/^[\w-]{11}$/.test(m.videoId||''))throw new Error('Invalid YouTube video.');
      if(m.src&&!/^assets\/images\/[a-z-]+\.jpg$/.test(m.src))throw new Error('Only bundled stock photos are allowed in a backup.');
    }
    for(const k of ['qrLabel','bank','accountName','accountNumber','otherLabel','otherDetails','otherUrl'])if(p.payments[k]!=null&&(typeof p.payments[k]!=='string'||p.payments[k].length>2500))throw new Error('Invalid payment details.');
    if(!Number.isFinite(Date.parse(p.createdAt))||!Number.isFinite(Date.parse(p.updatedAt)))throw new Error('Invalid story date.');
  }
  async function importData(data){
    if(data?.format!=='michaels-journey'||data.version!==1||!Array.isArray(data.posts)||data.posts.length>500||!Array.isArray(data.media))throw new Error('Choose a Michael’s Journey backup JSON file.');
    data.posts.forEach(validatePost);const ids=new Set();for(const p of data.posts){if(ids.has(p.id))throw new Error('Duplicate story IDs in backup.');ids.add(p.id);}
    const media=[];let total=0;const mediaIds=new Set();
    for(const m of data.media){if(typeof m.id!=='string'||mediaIds.has(m.id)||typeof m.data!=='string'||!/^data:(image\/(jpeg|png|webp|gif)|video\/(mp4|webm|ogg));base64,/.test(m.data))throw new Error('Unsupported or duplicate media in backup.');mediaIds.add(m.id);const blob=await(await fetch(m.data)).blob();total+=blob.size;if(total>250*1024*1024)throw new Error('This backup is larger than the 250 MB demo limit.');media.push({id:m.id,blob});}
    for(const p of data.posts)for(const m of [...p.media,p.payments.qr].filter(Boolean))if(!m.src&&m.kind!=='youtube'&&!mediaIds.has(m.id))throw new Error('The backup is missing an uploaded file.');
    const d=await open();if(!d)throw new Error('Browser storage is unavailable.');const tx=d.transaction(['posts','media'],'readwrite');tx.objectStore('posts').clear();tx.objectStore('media').clear();data.posts.forEach(p=>tx.objectStore('posts').put(p));media.forEach(m=>tx.objectStore('media').put(m));await waitTx(tx);for(const u of urls.values())URL.revokeObjectURL(u);urls.clear();
  }
  return {categories,all,get,save,remove,source,published,exportData,importData,open,get storageOK(){return storageOK;}};
})();
