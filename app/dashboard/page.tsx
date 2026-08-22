"use client";

import Link from "next/link";
import { Arrow } from "../components/SiteHeader";
import { DashboardIcon, useDashboard } from "./DashboardShell";

export default function DashboardPage() {
  const { accountName } = useDashboard();

  return <>
    <section className="dashboardWelcome">
      <div><span className="sectionKicker">WELCOME, {accountName.toUpperCase()}</span><h2>Tell Hollyway what <em>you need.</em></h2><p>Buy, sell, request a service, or get help from the Admin desk.</p></div>
      <div className="dashboardWelcomeActions"><Link className="dashboardPrimaryButton" href="/dashboard/listings">List an item <Arrow /></Link><Link className="dashboardSecondaryButton" href="/dashboard/requests">Make a request <Arrow /></Link></div>
    </section>

    <section className="dashboardStats" aria-label="Account summary">
      <article className="dashboardStat"><span className="dashboardStatIcon blue"><DashboardIcon name="box" /></span><div><small>ACTIVE LISTINGS</small><strong>0</strong><span>No listings yet</span></div></article>
      <article className="dashboardStat"><span className="dashboardStatIcon orange"><DashboardIcon name="search" /></span><div><small>OPEN REQUESTS</small><strong>0</strong><span>Nothing to track</span></div></article>
      <article className="dashboardStat"><span className="dashboardStatIcon purple"><DashboardIcon name="shield" /></span><div><small>ORDERS &amp; ESCROW</small><strong>0</strong><span>No active orders</span></div></article>
      <article className="dashboardStat"><span className="dashboardStatIcon green"><DashboardIcon name="grid" /></span><div><small>KYC STATUS</small><strong className="dashboardStatus">Not started</strong><span>Verification is required for high-value transactions</span></div></article>
    </section>

    <section className="dashboardColumns">
      <article className="dashboardPanel dashboardActivity"><div className="dashboardPanelHeading"><div><span className="sectionKicker">YOUR ACTIVITY</span><h3>Recent activity</h3></div><Link href="/dashboard">View all <Arrow /></Link></div><div className="dashboardEmpty"><span className="dashboardEmptyIcon"><DashboardIcon name="grid" /></span><strong>Your activity will appear here</strong><p>Start by listing an item or telling Hollyway what you are looking for.</p><Link className="dashboardTextButton" href="/dashboard/listings">Get started <Arrow /></Link></div></article>
      <article className="dashboardPanel dashboardQuick"><div className="dashboardPanelHeading"><div><span className="sectionKicker">QUICK ACTIONS</span><h3>What would you like to do?</h3></div></div><div className="dashboardQuickList"><Link href="/dashboard/listings"><span className="dashboardQuickIcon blue"><DashboardIcon name="box" /></span><span><b>Sell an item</b><small>List for free and reach buyers</small></span><Arrow /></Link><Link href="/dashboard/requests"><span className="dashboardQuickIcon orange"><DashboardIcon name="search" /></span><span><b>Request an item</b><small>Tell us what you need</small></span><Arrow /></Link><Link href="/#contact"><span className="dashboardQuickIcon purple"><DashboardIcon name="users" /></span><span><b>Talk to Admin</b><small>Get assisted service on WhatsApp</small></span><Arrow /></Link></div></article>
    </section>

    <section className="dashboardTrust"><span className="dashboardTrustIcon"><DashboardIcon name="shield" /></span><div><span className="sectionKicker">BUY WITH CONFIDENCE · SELL WITH CONFIDENCE</span><h3>Your safety comes first.</h3><p>Use official Hollyway references, review listing details carefully, and wait for Admin confirmation before making a transaction payment.</p></div><Link href="/#logistics">Learn how it works <Arrow /></Link></section>
  </>;
}
