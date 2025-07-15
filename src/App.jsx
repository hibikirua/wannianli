import { useState } from 'react'
import './App.css'
import { Solar, Lunar } from 'lunar-javascript'

function isValidDate(y, m, d) {
  if (!y || !m || !d) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function App() {
  // 输入类型：solar（公历转农历）或 lunar（农历转公历）
  const [type, setType] = useState('solar')
  // 公历输入
  const [solar, setSolar] = useState({ year: '2024', month: '6', day: '1' })
  // 农历输入
  const [lunar, setLunar] = useState({ year: '2024', month: '4', day: '24', isLeap: false })
  // 结果
  let result = null

  if (type === 'solar') {
    if (!isValidDate(Number(solar.year), Number(solar.month), Number(solar.day))) {
      result = <div className="result error">请输入有效的公历日期</div>;
    } else {
      try {
        const s = Solar.fromYmd(Number(solar.year), Number(solar.month), Number(solar.day))
        const l = s.getLunar()
        result = (
          <div className="result">
            <div>农历：{l.getMonth() < 0 ? '闰' : ''}{l.getYear()}年{Math.abs(l.getMonth())}月{l.getDayInChinese()}日</div>
            <div>生肖：{l.getYearShengXiao()}</div>
            <div>节气：{l.getJieQi() || '无'}</div>
            <div>节日：{[...l.getFestivals(), ...s.getFestivals()].join('，') || '无'}</div>
          </div>
        )
      } catch (e) {
        result = <div className="result error">转换失败，请检查日期<br/>错误信息：{e.message || String(e)}</div>
      }
    }
  } else {
    try {
      const l = Lunar.fromYmd(Number(lunar.year), Number(lunar.month), Number(lunar.day), lunar.isLeap)
      const s = l.getSolar()
      result = (
        <div className="result">
          <div>公历：{s.getYear()}年{s.getMonth()}月{s.getDay()}日</div>
          <div>节气：{l.getJieQi() || '无'}</div>
          <div>节日：{[...l.getFestivals(), ...s.getFestivals()].join('，') || '无'}</div>
        </div>
      )
    } catch (e) {
      result = <div className="result error">输入的农历日期无效</div>
    }
  }

  return (
    <div className="calendar-container">
      <div className="calendar-logo">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="12" width="48" height="44" rx="6" fill="#FFD600" stroke="#222" strokeWidth="2"/>
          <rect x="8" y="20" width="48" height="36" rx="4" fill="#fff" stroke="#222" strokeWidth="2"/>
          <rect x="16" y="28" width="8" height="8" rx="2" fill="#FFD600" stroke="#222" strokeWidth="1.5"/>
          <rect x="28" y="28" width="8" height="8" rx="2" fill="#FFD600" stroke="#222" strokeWidth="1.5"/>
          <rect x="40" y="28" width="8" height="8" rx="2" fill="#FFD600" stroke="#222" strokeWidth="1.5"/>
          <rect x="16" y="40" width="8" height="8" rx="2" fill="#FFD600" stroke="#222" strokeWidth="1.5"/>
          <rect x="28" y="40" width="8" height="8" rx="2" fill="#FFD600" stroke="#222" strokeWidth="1.5"/>
          <rect x="40" y="40" width="8" height="8" rx="2" fill="#FFD600" stroke="#222" strokeWidth="1.5"/>
          <rect x="20" y="8" width="4" height="8" rx="2" fill="#222"/>
          <rect x="40" y="8" width="4" height="8" rx="2" fill="#222"/>
        </svg>
      </div>
      <h1>万年历转换</h1>
      <div className="switcher">
        <button className={type === 'solar' ? 'active' : ''} onClick={() => setType('solar')}>公历转农历</button>
        <button className={type === 'lunar' ? 'active' : ''} onClick={() => setType('lunar')}>农历转公历</button>
      </div>
      {type === 'solar' ? (
        <div className="input-area">
          <label>公历日期：</label>
          <input type="text" pattern="[0-9]*" value={solar.year} maxLength="4" onChange={e => setSolar({ ...solar, year: e.target.value.replace(/\D/g, '') })} /> 年
          <input type="text" pattern="[0-9]*" value={solar.month} maxLength="2" onChange={e => setSolar({ ...solar, month: e.target.value.replace(/\D/g, '') })} /> 月
          <input type="text" pattern="[0-9]*" value={solar.day} maxLength="2" onChange={e => setSolar({ ...solar, day: e.target.value.replace(/\D/g, '') })} /> 日
        </div>
      ) : (
        <div className="input-area">
          <label>农历日期：</label>
          <input type="text" pattern="[0-9]*" value={lunar.year} maxLength="4" onChange={e => setLunar({ ...lunar, year: e.target.value.replace(/\D/g, '') })} /> 年
          <input type="text" pattern="[0-9]*" value={lunar.month} maxLength="2" onChange={e => setLunar({ ...lunar, month: e.target.value.replace(/\D/g, '') })} /> 月
          <input type="text" pattern="[0-9]*" value={lunar.day} maxLength="2" onChange={e => setLunar({ ...lunar, day: e.target.value.replace(/\D/g, '') })} /> 日
          <label><input type="checkbox" checked={lunar.isLeap} onChange={e => setLunar({ ...lunar, isLeap: e.target.checked })} /> 闰月</label>
        </div>
      )}
      {result}
      <div className="footer">数据来源：lunar-javascript | 仅供参考</div>
    </div>
  )
}

export default App
