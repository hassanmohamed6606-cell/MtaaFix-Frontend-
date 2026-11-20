import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, ShieldCheck, Users, ClipboardCheck } from 'lucide-react'
import ReportCard from '../components/ReportCard'
import { sampleReports } from '../data/sampleReports'

export default function Home() {
  return <div>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot"/> YOUR COMMUNITY, YOUR VOICE</span>
        <h1>See a problem?<br/><em>Let's fix it together.</em></h1>
        <p>MtaaFix gives residents a simple way to report neighbourhood issues, share their location and follow progress towards a better community.</p>
        <div className="hero-actions"><Link className="btn btn-primary" to="/new-report">Report an issue <ArrowRight size={17}/></Link><Link className="btn btn-outline" to="/reports">Explore reports</Link></div>
        <div className="hero-proof"><span><Users size={16}/> Community-powered</span><span><ShieldCheck size={16}/> Transparent tracking</span></div>
      </div>
      <div className="hero-visual">
        <div className="map-art">
          <div className="map-road road-one"/><div className="map-road road-two"/><div className="map-road road-three"/>
          <div className="map-block block-one"/><div className="map-block block-two"/><div className="map-block block-three"/>
          <div className="map-pin pin-one"><MapPin size={18}/></div><div className="map-pin pin-two"><MapPin size={18}/></div>
          <div className="map-callout"><span className="pulse"/>Community report submitted<strong>Road damage · Nairobi</strong></div>
          <div className="map-caption">A better neighbourhood starts here.</div>
        </div>
      </div>
    </section>
    <section className="stats-strip">
      <div><strong>One place</strong><span>to raise concerns</span></div><div><strong>Clear updates</strong><span>on report progress</span></div><div><strong>Shared action</strong><span>for stronger communities</span></div>
    </section>
    <section className="section page-wrap">
      <div className="section-heading"><div><span className="eyebrow">HOW IT WORKS</span><h2>Small actions. Visible change.</h2></div><Link className="text-link" to="/reports">View all reports <ArrowRight size={16}/></Link></div>
      <div className="steps-grid">
        <div className="step-card"><span>01</span><MapPin/><h3>Pin the problem</h3><p>Choose a category and identify where the issue is happening.</p></div>
        <div className="step-card"><span>02</span><ClipboardCheck/><h3>Submit a report</h3><p>Describe what needs attention so the community can understand it.</p></div>
        <div className="step-card"><span>03</span><Users/><h3>Follow progress</h3><p>See reports and track their status as action is taken.</p></div>
      </div>
    </section>
    <section className="section page-wrap">
      <div className="section-heading"><div><span className="eyebrow">FROM THE COMMUNITY</span><h2>Issues that need attention</h2></div><Link className="text-link" to="/reports">Explore community reports <ArrowRight size={16}/></Link></div>
      <div className="report-grid">{sampleReports.slice(0,3).map(report => <ReportCard key={report.id} report={report}/>)}</div>
    </section>
    <section className="cta-band page-wrap"><div><span className="eyebrow">MAKE YOUR VOICE COUNT</span><h2>Your neighbourhood deserves better.</h2><p>Start by reporting one issue that matters.</p></div><Link className="btn btn-light" to="/new-report">Submit a report <ArrowRight size={16}/></Link></section>
  </div>
}

