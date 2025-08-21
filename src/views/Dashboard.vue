<template>
  <div class="min-h-screen bg-gradient-to-br from-accent/10 via-white to-primary/10 flex flex-col">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Dashboard Content -->
      <main class="flex-1 px-10 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8 bg-transparent">
        <!-- Header with Search & Profile -->
        <div class="xl:col-span-3">
          <HeaderBar />
        </div>
        <!-- Center Section with Statistics -->
        <section class="xl:col-span-2 flex flex-col gap-8">
          <!-- Stat Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow p-5 text-center">
              <div class="text-sm text-tertiary/70 mb-1">Open</div>
              <div class="text-2xl font-extrabold text-tertiary mb-1">$128,000</div>
              <div class="text-xs text-tertiary/60">Week: $48k</div>
            </div>
            <div class="bg-white rounded-xl shadow p-5 text-center">
              <div class="text-sm text-tertiary/70 mb-1">Won</div>
              <div class="text-2xl font-extrabold text-tertiary mb-1">$24,300</div>
              <div class="text-xs text-tertiary/60">Week: $9.6k</div>
            </div>
            <div class="bg-white rounded-xl shadow p-5 text-center">
              <div class="text-sm text-tertiary/70 mb-1">Lost</div>
              <div class="text-2xl font-extrabold text-tertiary mb-1">$8,900</div>
              <div class="text-xs text-tertiary/60">Week: $3.3k</div>
            </div>
          </div>
          <!-- Tasks -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow p-6 min-h-44 flex flex-col gap-2">
              <div class="font-semibold text-tertiary mb-2">Follow Ups</div>
              <ul class="text-tertiary text-sm flex flex-col gap-2">
                <li><b>Follow up</b> with Acme Corp <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Today</span></li>
                <li>Send proposal to Globex <span class="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Due</span></li>
                <li>Update date stage - Nimbus <span class="text-xs bg-tertiary/10 text-tertiary px-2 py-1 rounded">Queued</span></li>
              </ul>
            </div>
            <div class="bg-gradient-to-tl from-accent/10 via-white to-primary/10 rounded-xl shadow p-6 min-h-44 flex flex-col items-center justify-center">
              <div class="font-semibold text-tertiary mb-2">Last Campaign</div>
              <div class="flex flex-col gap-1 w-full text-center">
                <div>Sent: <b>12,500</b></div>
                <div>Opens: <b>5,340 (42%)</b></div>
                <div>Clicks: <b>1,120 (9%)</b></div>
                <div>Bounces: <b>220 (1.7%)</b></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Right Section: Suggestions, Deals, Contacts -->
        <aside class="flex flex-col gap-8">
          <div class="bg-white rounded-xl shadow p-6">
            <div class="font-semibold text-tertiary mb-3">Suggestions</div>
            <ul class="text-tertiary/70 text-sm flex flex-col gap-2">
              <li>Try sequencing warm leads from last 7 days.</li>
              <li>Batch-complete admin tasks after 4 PM.</li>
              <li>Best send time for emails: 9–11 AM local.</li>
            </ul>
          </div>
          <div class="bg-white rounded-xl shadow p-6 flex flex-row gap-3">
            <button class="bg-primary/10 text-primary font-semibold rounded px-3 py-2 text-xs">New Deal</button>
            <button class="bg-secondary/10 text-secondary font-semibold rounded px-3 py-2 text-xs">Add Contact</button>
            <button class="bg-tertiary/10 text-tertiary font-semibold rounded px-3 py-2 text-xs">New Task</button>
          </div>
          <div class="bg-white rounded-xl shadow p-6">
            <div class="font-semibold text-tertiary mb-3">Recent Contacts</div>
            <ul class="text-tertiary text-sm flex flex-col gap-2">
              <li class="flex justify-between items-center">
                <span>Jane Cooper</span><span class="text-xs text-tertiary/60">Acme Corp · Mar 12</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Devon Lane</span><span class="text-xs text-tertiary/60">Globex · Mar 11</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Kristin Watson</span><span class="text-xs text-tertiary/60">Initech · Mar 11</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Jacob Jones</span><span class="text-xs text-tertiary/60">Hooli · Mar 10</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Theresa Webb</span><span class="text-xs text-tertiary/60">Pied Piper · Mar 10</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'
</script>
