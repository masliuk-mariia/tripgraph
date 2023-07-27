const getResources = async(url)=>{
  const res = await fetch(url);
  if (!res.ok){
    throw new Error("Can't fetch data from ${url}, status: ${res.status}");
  }
  return await res.json();
};
let gal;

const monthArr = ['Jan', 'Feb', 'Mat', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class Gallery{
  constructor(url='database.json', startDate_s=0, endDate_s=0){
    this.startDate_s = startDate_s;
    this.endDate_s = endDate_s;
    this.galleryItems = [];
    this.sortItems = [];
    this.url = url;
    this.container = document.querySelector(".trips__row");
  }
  fetchItems(){
    getResources(this.url)
    .then(data => this.readItems(data.gallery))
    .catch(err => console.log(err));
  }
  readItems(data){
    data.forEach(cur => {
      const item = {};
      item.title = cur.title;
      item.rating = cur.rating;
      item.date_start = new Date(cur.date_start).toISOString();
      item.ms_start = Date.parse(item.date_start);
      item.date_end = new Date(cur.date_end).toISOString();
      item.ms_end = Date.parse(item.date_end);
      item.img = cur.img;
      item.descr = cur.descr;
      this.galleryItems.push(item);
    })
    this.sortItems = this.filterItems();
    this.showItems();
  }
  filterItems(){
    if (this.startDate_s ==0 || this.endDate_s ==0){
      return this.galleryItems;
    }
    const t1 = this.startDate_s;
    const t2 = this.endDate_s;
    const result = this.galleryItems.filter(function (el){
      return el.ms_start >= t1 &&
              el.ms_end <= t2;
    });
    result.sort((a, b) => a.ms_start - b.ms_start);
    return result;
    
  }
  makeTime(date_from, date_to){
    const t1 = new Date(date_from);
    const t2 = new Date(date_to);
    const day1 = t1.getDate();
    const month1 = monthArr[t1.getMonth()];
    const day2 = t2.getDate();
    const month2 = monthArr[t2.getMonth()];
    const timeStr = `<time><span>${month1}</span> ${day1}</time> - 
    <time><span>${month2}</span> ${day2}</time>`;
    return timeStr;
  }
  showItems(){
    this.container.innerHTML = '';
    this.sortItems.forEach(cur => {
      const rating = document.createElement("div");
      for (let i = 1; i < 6; i++){
        const span = document.createElement("span");
        span.classList.add("icon-star");
        if (cur.rating >=i){
          span.classList.add("checked");
        }
        rating.append(span);
      }
      const time = this.makeTime(cur.date_start, cur.date_end);


      const elem = document.createElement("div");
      elem.classList.add("trips__column");
      elem.innerHTML = `
      <div class="trips__item">
      <div class="trips__image _ibg">
        <img src="${cur.img}" alt="">
        <div class="trips__title">${cur.title}</div>
        <div class="trips__rating">${rating.innerHTML}</div>
      </div>
      <div class="trips__card">
        <div class="trips__label">
          <div class="trips__date">
          ${time}
        </div>
        <a  class="trips__link" href="#">&gt;</a>
        </div>
        <div class="trips__descr">${cur.descr}</div>
      </div>
    </div>
      `;
      this.container.append(elem);
    });
  }
 
}

function makeDays(selector){
  for (let i = 1; i <= 31; i++){
    const opt = document.createElement("option");
    let val = i;
    if (val < 10){val = '0'+val} 
    opt.value = val;
    opt.innerHTML = i;
    selector.append(opt);
  }
}
function makeMonth(selector){
  monthArr.forEach((name, index)=>{
    const opt = document.createElement("option");
    let val = index + 1;
    if (val < 10){val = '0'+val} 
    opt.value = val;
    opt.innerHTML = name;
    selector.append(opt);
  })
}

function makeCalendar(){
  const calendar_frm = document.querySelector(".calendar__frm");
  const day_from = calendar_frm.querySelector("#date_from_day");
  const day_to = calendar_frm.querySelector("#date_to_day");
  const m_from = calendar_frm.querySelector("#date_from_month");
  const m_to = calendar_frm.querySelector("#date_to_month");
  const close = calendar_frm.querySelector("#calendar_close");
  makeDays(day_from);
  makeDays(day_to);
  makeMonth(m_from);
  makeMonth(m_to);
  
  calendar_frm.addEventListener("submit", ()=>{
    let search_start = '2022-' + m_from.value + '-' + day_from.value;
    search_start = new Date(search_start).toISOString();
    const search_start_sec = Date.parse(search_start);
    let search_end = '2022-' + m_to.value + '-' + day_to.value;
    search_end = new Date(search_end).toISOString();
    const search_end_sec = Date.parse(search_end);
    gal.startDate_s = search_start_sec;
    gal.endDate_s = search_end_sec;
    gal.sortItems = gal.filterItems();
    gal.showItems();
    document.querySelector(".calendar").classList.remove("show");
    document.querySelector(".calendar").classList.add("hide");
  });
  close.addEventListener("click", ()=>{
    document.querySelector(".calendar").classList.remove("show");
    document.querySelector(".calendar").classList.add("hide");
  });
  document.querySelector("#calendar_show").addEventListener("click", ()=>{
    document.querySelector(".calendar").classList.remove("hide"); 
    document.querySelector(".calendar").classList.add("show");
  })

}


export function main(){
  const check_container = document.querySelector(".trips__row");
  if (!check_container){return;}
  makeCalendar();
  gal = new Gallery('http://localhost:3000/files/database.json', 0, 0);
  gal.fetchItems();

  const list_btn = document.querySelector("#list_show");
  if (!list_btn){return;}
  list_btn.addEventListener("click", ()=>{
    gal.startDate_s = 0;
    gal.endDate_s = 0;
    gal.sortItems = gal.filterItems();
    gal.showItems();
  })
}