import Image from "next/image"
import { Activity, BarChart3, Database, MapPinned, ShieldCheck } from "lucide-react"

export default function StuntlyticsPreview() {
  return (
    <div
      className="stuntlytics-preview"
      role="img"
      aria-label="StuntLytics child-health analytics workspace with regional risk monitoring, trends, and evidence insights"
    >
      <div className="stuntlytics-window">
        <div className="stuntlytics-window-bar">
          <div className="stuntlytics-brand">
            <span><Image src="/projects/stuntlytics-logo.png" alt="" width={31} height={19} /></span>
            <strong>StuntLytics</strong>
          </div>
          <div className="stuntlytics-window-dots"><i /><i /><i /></div>
        </div>

        <div className="stuntlytics-app">
          <aside className="stuntlytics-sidebar" aria-hidden="true">
            <span className="is-active"><Activity size={15} /></span>
            <span><MapPinned size={15} /></span>
            <span><BarChart3 size={15} /></span>
            <span><Database size={15} /></span>
          </aside>

          <div className="stuntlytics-dashboard">
            <div className="stuntlytics-heading">
              <div><small>REGIONAL OVERVIEW</small><strong>Health intelligence workspace</strong></div>
              <span><ShieldCheck size={13} /> Decision support</span>
            </div>

            <div className="stuntlytics-kpis">
              <div><small>Screening model</small><strong>18 inputs</strong><em>Local inference</em></div>
              <div><small>Monitoring</small><strong>Risk map</strong><em>Regional signals</em></div>
              <div><small>Evidence layer</small><strong>Private by design</strong><em>Aggregated only</em></div>
            </div>

            <div className="stuntlytics-panels">
              <div className="stuntlytics-panel stuntlytics-map">
                <div className="stuntlytics-panel-title"><span>Priority map</span><small>LIVE VIEW</small></div>
                <div className="stuntlytics-map-shape" aria-hidden="true">
                  <i className="map-area map-area-one" /><i className="map-area map-area-two" />
                  <i className="map-area map-area-three" /><i className="map-area map-area-four" />
                  <b className="map-pin pin-one" /><b className="map-pin pin-two" /><b className="map-pin pin-three" />
                </div>
                <div className="stuntlytics-legend"><span><i />Review</span><span><i />Monitor</span></div>
              </div>

              <div className="stuntlytics-panel stuntlytics-trend">
                <div className="stuntlytics-panel-title"><span>Indicator trend</span><small>12 MONTHS</small></div>
                <svg viewBox="0 0 250 112" aria-hidden="true">
                  <defs>
                    <linearGradient id="stuntlyticsArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#24b7a4" stopOpacity=".32" />
                      <stop offset="1" stopColor="#24b7a4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="trend-grid" d="M8 24H242M8 56H242M8 88H242" />
                  <path className="trend-area" d="M8 86 C36 80 44 55 70 62 S105 83 128 61 S161 30 184 43 S218 55 242 25 V104 H8 Z" />
                  <path className="trend-line" d="M8 86 C36 80 44 55 70 62 S105 83 128 61 S161 30 184 43 S218 55 242 25" />
                  <circle cx="242" cy="25" r="4" />
                </svg>
              </div>
            </div>

            <div className="stuntlytics-evidence">
              <span><i />Evidence API connected</span>
              <span>Dashboard · Explorer · Screening · Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
