<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div
            v-for="{
              title,
              value,
              description,
              icon: { component, background, shape },
            } of cardData"
            :key="title"
            class="col-lg-3 col-md-6 col-12"
          >
            <MiniStatisticsCard
              :title="title"
              :value="value"
              :description="description"
              :icon="{
                component: component,
                background: background,
                shape: shape,
              }"
            />
          </div>
        </div>

        <div class="flex w-full gap-4">
          <div class="flex flex-col w-full gap-4 mb-4">
            <div class="card shadow-lg h-56 p-4">
              <div
                class="w-full h-full flex items-center justify-center inset-0"
              >
                <div
                  class="bg-gray-300 rounded-full w-36 h-36 flex justify-center items-center"
                >
                  <i class="fa fa-user fa-4x text-gray-300"></i>
                </div>
              </div>
            </div>
            <div class="card shadow-lg h-max p-4">
              <h5>Sites mais acessados</h5>
              <div class="flex mt-2 border-b py-2 items-center justify-between">
                <a
                  target="_blank"
                  href="http://www.pag.com"
                  class="text-lg font-semibold"
                  >www.pag.com</a
                >
                <div class="w-1/2 flex items-center gap-2">
                  <span class="font-bold">20%</span>
                  <div
                    class="w-full h-[0.6rem] rounded-2xl flex items-start bg-gray-400 overflow-hidden"
                  >
                    <div class="bg-purple-700 w-[20%] h-[0.6rem]"></div>
                  </div>
                </div>
              </div>
              <div class="flex mt-2 border-b py-2 items-center justify-between">
                <a
                  target="_blank"
                  href="http://www.office.com"
                  class="text-lg font-semibold"
                  >www.office.com</a
                >
                <div class="w-1/2 flex items-center gap-2">
                  <span class="font-bold">16%</span>
                  <div
                    class="w-full h-[0.6rem] rounded-2xl flex items-start bg-gray-400 overflow-hidden"
                  >
                    <div class="bg-purple-700 w-[20%] h-[0.6rem]"></div>
                  </div>
                </div>
              </div>
              <div class="flex mt-2 border-b py-2 items-center justify-between">
                <a
                  target="_blank"
                  href="http://www.youtube.com"
                  class="text-lg font-semibold"
                  >www.youtube.com</a
                >
                <div class="w-1/2 flex items-center gap-2">
                  <span></span><span class="font-bold">9%</span>
                  <div
                    class="w-full h-[0.6rem] rounded-2xl flex items-start bg-gray-400 overflow-hidden"
                  >
                    <div class="bg-purple-700 w-[9%] h-[0.6rem]"></div>
                  </div>
                </div>
              </div>
              <div class="flex mt-2 border-b py-2 items-center justify-between">
                <a
                  target="_blank"
                  href="http://www.metal.com"
                  class="text-lg font-semibold"
                  >www.metal.com</a
                >
                <div class="w-1/2 flex items-center gap-2">
                  <span></span><span class="font-bold">6%</span>
                  <div
                    class="w-full h-[0.6rem] rounded-2xl flex items-start bg-gray-400 overflow-hidden"
                  >
                    <div class="bg-purple-700 w-[6%] h-[0.6rem]"></div>
                  </div>
                </div>
              </div>

              <div class="flex mt-2 border-b py-2 items-center justify-between">
                <a
                  target="_blank"
                  href="http://www.facebook.com"
                  class="text-lg font-semibold"
                  >www.facebook.com</a
                >
                <div class="w-1/2 flex items-center gap-2">
                  <span></span><span class="font-bold">4%</span>
                  <div
                    class="w-full h-[0.6rem] rounded-2xl flex items-start bg-gray-400 overflow-hidden"
                  >
                    <div class="bg-purple-700 w-[4%] h-[0.6rem]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card shadow-lg h-56 p-4">
              <h5>Últimos Arquivos Manipulados</h5>
            </div>
          </div>

          <div class="flex flex-col w-full gap-4 mb-4">
            <div class="card shadow-lg h-max p-4">
              <h5>Informações de Rede</h5>
              <div class="flex flex-col w-full">
                <div class="flex gap-3 items-center mt-4">
                  <div class="bg-blue-500 text-white px-3 py-1 rounded-full">
                    WAN1
                  </div>
                  <div>WAN2</div>
                </div>
                <div class="flex justify-between mt-4">
                  <p class="font-semibold">Internet</p>
                  <span>North telecom</span>
                </div>
                <div class="flex justify-between -mt-1">
                  <p class="font-semibold">Uptime</p>
                  <span class="text-green-500">100%</span>
                </div>
                <div class="flex justify-between -mt-1">
                  <p class="font-semibold">Activity</p>
                  <div class="flex gap-2">
                    <p class="text-blue-500">&uarr; 0.00 Mbps</p>
                    <p class="text-purple-500">&darr; 0.01 Mbps</p>
                  </div>
                </div>
                <div class="w-full border-b mt-3"></div>
                <div class="mt-2">
                  <p class="text-md font-bold text-black">Internet Health</p>
                  <div
                    class="w-full h-[0.6rem] rounded-2xl flex items-start bg-gray-400 overflow-hidden"
                  >
                    <div class="bg-green-500 w-3/4 h-[0.6rem]"></div>
                  </div>
                </div>

                <div class="w-full border-b mt-5"></div>
                <div class="mt-2">
                  <div class="flex justify-between w-full">
                    <p class="text-md font-bold text-black">Speed Test</p>
                    <div class="text-blue-500">Run Now</div>
                  </div>

                  <p class="text-gray-500 text-xs -mt-4">
                    Runs Daily at 05:00 AM
                  </p>
                </div>
                <div class="mt-2">
                  <p class="text-md font-bold text-black">Last Speed Test</p>
                  <p class="text-gray-500 text-xs -mt-4">Mar 18 at 05:00 AM</p>
                </div>
              </div>
            </div>
            <!-- <div class="card shadow-lg h-56 p-4">
              <p>card 5</p>
            </div> -->
            <div class="card shadow-lg h-56 p-4">
              <h5>Conformidade e Segurança</h5>
            </div>
          </div>

          <div class="flex flex-col w-full gap-4 mb-4">
            <div class="card shadow-lg h-56 p-4">
              <h5>UPTIME Servidores - Ativos Críticos</h5>
            </div>
            <div class="card shadow-lg h-max p-4">
              <h5>Traffic Identification</h5>
              <div class="flex w-full">
                <div class="border rounded-lg flex w-max relative">
                  <div
                    class="absolute inset-0 z-50 flex flex-col items-center justify-center"
                  >
                    <p class="text-black font-bold text-lg">4.47 GB</p>
                    <span class="text-xs -mt-5">Indentified Traffic</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 630 375"
                    width="100%"
                    height="100%"
                  >
                    <path
                      fill="#94d13d"
                      d="M314.9706710586679 43.50000298675974 A 144 144 0 0 1 383.6320697346512 314.09241290037085 L 359.6108453275233 269.785068385241 A 93.6 93.6 0 0 0 314.98093618813414 93.90000194139384 Z"
                      transform="translate(0,0)"
                      stroke="#ffffff"
                      stroke-width="1"
                      opacity="1"
                      stroke-linejoin="round"
                      class="highcharts-point highcharts-color-0"
                      tabindex="-1"
                      role="img"
                      aria-label="Item 1, 80."
                      style="outline: none"
                    ></path>
                    <path
                      fill="#6f58e9"
                      d="M383.5054430268176 314.1609816624656 A 144 144 0 0 1 171.50282378272388 199.52332806123187 L 221.72683545877055 195.3151632398007 A 93.6 93.6 0 0 0 359.5285379674314 269.82963808060265 Z"
                      transform="translate(0,0)"
                      stroke="#ffffff"
                      stroke-width="1"
                      opacity="1"
                      stroke-linejoin="round"
                      class="highcharts-point highcharts-color-1"
                      tabindex="-1"
                      role="img"
                      aria-label="Item 2, 60."
                      style="outline: none"
                    ></path>
                    <path
                      fill="#2d99fe"
                      d="M171.49087220524865 199.37982489726727 A 144 144 0 0 1 226.43965778031728 73.95236336262792 L 257.4357775572062 113.69403618570814 A 93.6 93.6 0 0 0 221.71906693341163 195.22188618322372 Z"
                      transform="translate(0,0)"
                      stroke="#ffffff"
                      stroke-width="1"
                      opacity="1"
                      stroke-linejoin="round"
                      class="highcharts-point highcharts-color-2"
                      tabindex="-1"
                      role="img"
                      aria-label="Item 3, 30."
                      style="outline: none"
                    ></path>
                    <path
                      fill="#2ddac1"
                      d="M226.55324967819752 73.86385980898186 A 144 144 0 0 1 314.7999868889177 43.5001389071663 L 314.8699914777965 93.90009028965811 A 93.6 93.6 0 0 0 257.5096122908284 113.6365088758382 Z"
                      transform="translate(0,0)"
                      stroke="#ffffff"
                      stroke-width="1"
                      opacity="1"
                      stroke-linejoin="round"
                      class="highcharts-point highcharts-color-3"
                      tabindex="-1"
                      role="img"
                      aria-label="Item 4, 20."
                      style="outline: none"
                    ></path>
                  </svg>
                </div>
                <div class="flex-grow flex flex-col">
                  <div class="flex justify-between px-3">
                    <p class="text-md font-bold text-black">Name</p>
                    <div class="flex w-1/2 justify-between">
                      <span class="text-md font-bold text-black">Download</span>
                      <span class="text-md font-bold text-black">Upload</span>
                    </div>
                  </div>

                  <div class="flex justify-between px-3">
                    <p class="text-md text-black">SSL/TLS</p>
                    <div class="flex w-1/2 justify-between">
                      <span class="text-md text-blue-500">1.89 GB</span>
                      <span class="text-md text-purple-500">20.2 MB</span>
                    </div>
                  </div>

                  <div class="flex justify-between px-3">
                    <p class="text-md text-black">Bitdefender</p>
                    <div class="flex w-1/2 justify-between">
                      <span class="text-md text-blue-500">1.24 GB</span>
                      <span class="text-md text-purple-500">16.2 MB</span>
                    </div>
                  </div>

                  <div class="flex justify-between px-3">
                    <p class="text-md text-black">Windows Update</p>
                    <div class="flex w-1/2 justify-between">
                      <span class="text-md text-blue-500">1.01 GB</span>
                      <span class="text-md text-purple-500">17.2 MB</span>
                    </div>
                  </div>

                  <div class="flex justify-between px-3">
                    <p class="text-md text-black">VM Ware</p>
                    <div class="flex w-1/2 justify-between">
                      <span class="text-md text-blue-500">88.0 MB</span>
                      <span class="text-md text-purple-500">58.2 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- TABLE -->
            <div class="card shadow-lg h-max p-4">
              <h5>Controle de Impressão</h5>
              <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div
                    class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                  >
                    <div
                      class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                    >
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Data
                            </th>
                            <th
                              scope="col"
                              class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Usuário
                            </th>
                            <th
                              scope="col"
                              class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Impressora
                            </th>
                            <th
                              scope="col"
                              class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Descriçao
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr>
                            <td class="px-5 py-3 whitespace-nowrap">
                              20/03/2024
                            </td>
                            <td class="px-5 py-3 whitespace-nowrap">João</td>
                            <td class="px-5 py-3 whitespace-nowrap">
                              Impressora A
                            </td>
                            <td class="px-5 py-3 whitespace-nowrap">
                              boleto_facul.pdf
                            </td>
                          </tr>
                          <!-- Mais linhas... -->
                          <tr>
                            <td class="px-5 py-3 whitespace-nowrap">
                              20/03/2024
                            </td>
                            <td class="px-5 py-3 whitespace-nowrap">João</td>
                            <td class="px-5 py-3 whitespace-nowrap">
                              Impressora A
                            </td>
                            <td class="px-5 py-3 whitespace-nowrap">
                              fatura.pdf
                            </td>
                          </tr>
                          <tr>
                            <td class="px-5 py-3 whitespace-nowrap">
                              20/03/2024
                            </td>
                            <td class="px-5 py-3 whitespace-nowrap">João</td>
                            <td class="px-5 py-3 whitespace-nowrap">
                              Impressora A
                            </td>
                            <td class="px-5 py-3 whitespace-nowrap">
                              boleto_facul.pdf
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- <div class="col-lg-12 mb-lg">
            <div class="card z-index-2">
              <div class="mb-0 pb-0 card-header">
                <h6>Overview Vendas</h6>
                <p class="text-sm">
                  <i class="fa fa-arrow-up text-success"></i>
                  <span class="font-weight-bold ms-1">4% mais</span> 2023
                </p>
              </div>
              <div class="p-0 card-body">
                <div class="chart">
                  <GradientLineChart
                    :chart-options="{
                      chart: { type: 'area' },
                      colors: ['#4BB543'],
                      labels: [
                        'Abr',
                        'Mai',
                        'Jun',
                        'Jul',
                        'Ago',
                        'Set',
                        'Out',
                        'Nov',
                        'Dez',
                      ],
                      dataLabels: { enabled: false },
                      stroke: { curve: 'smooth' },
                      legend: { show: false },
                    }"
                  />
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <!-- <div class="row mt-4 border-red-500">
          <div class="col-12 col-lg-7">
            <ProjectCard
              :headers="['Serviços', 'Previsão', 'Status', 'Realizado', '']"
              :items="[
                {
                  brand: { logo: blank, name: 'Mass. Masculino I' },
                  badge: { text: 'Médio', color: 'info' },
                  progress: 60,
                  budget: 'R$4.500,00',
                },
                {
                  brand: { logo: blank, name: 'Mass. Feminino I' },
                  badge: { text: 'Total', color: 'success' },
                  progress: 100,
                  budget: 'R$3.000,00',
                },
                {
                  brand: { logo: blank, name: 'Mass. Masculino II ' },
                  badge: { text: 'Baixo', color: 'danger' },
                  progress: 30,
                  budget: 'R$19.400,00',
                },
                {
                  brand: { logo: blank, name: 'Mass. Feminino II' },
                  badge: { text: 'Baixissimo', color: 'danger' },
                  progress: 0,
                  budget: 'R$10.000,00',
                },
              ]"
            />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import jira from "~/assets/img/small-logos/logo-jira.svg";
import spotify from "~/assets/img/small-logos/logo-spotify.svg";
import invision from "~/assets/img/small-logos/logo-invision.svg";
import slack from "~/assets/img/small-logos/logo-slack.svg";
import adobe from "~/assets/img/small-logos/logo-xd.svg";

import US from "~/assets/img/icons/flags/US.png";
import DE from "~/assets/img/icons/flags/DE.png";
import GB from "~/assets/img/icons/flags/GB.png";
import BR from "~/assets/img/icons/flags/BR.png";

import MiniStatisticsCard from "~~/examples/cards/MiniStatisticsCard.vue";
import GradientLineChart from "~~/examples/charts/GradientLineChart.vue";
import PostCard from "~~/examples/cards/PostCard.vue";
import ProjectCard from "~~/pagesComponents/dashboards/default/ProjectCard.vue";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
const cardData = [
  {
    title: "Vendido Hoje",
    value: "R$53,000",
    description: `<span
                  class='text-sm font-weight-bolder text-success'
                  >+35%</span>`,
    icon: {
      component: "ni ni-money-coins",
      background: "bg-gradient-primary",
      shape: "rounded-circle",
    },
  },
  {
    title: "Usuários Cadastrados",
    value: "66.500",
    description: `<span
                  class='text-sm font-weight-bolder text-success'
                  >+3%</span> U`,
    icon: {
      component: "ni ni-world",
      background: "bg-gradient-danger",
      shape: "rounded-circle",
    },
  },
  {
    title: "Novos Agendamentos",
    value: "+280",
    description: `<span
                  class='text-sm font-weight-bolder text-danger'
                  >-2%</span> desde a última semana`,
    icon: {
      component: "ni ni-paper-diploma",
      background: "bg-gradient-success",
      shape: "rounded-circle",
    },
  },
  {
    title: "Novos Agendamentos",
    value: "+280",
    description: `<span
                  class='text-sm font-weight-bolder text-danger'
                  >-2%</span> desde a última semana`,
    icon: {
      component: "ni ni-paper-diploma",
      background: "bg-gradient-success",
      shape: "rounded-circle",
    },
  },
];

const sales = {
  us: {
    country: "United States",
    sale: 2500,
    value: "$2302131,900",
    bounce: "29.9%",
    flag: US,
  },
  germany: {
    country: "Germany",
    sale: "3.900",
    value: "$440,000",
    bounce: "40.22%",
    flag: DE,
  },
  britain: {
    country: "Great Britain",
    sale: "1.400",
    value: "$190,700",
    bounce: "23.44%",
    flag: GB,
  },
  brasil: {
    country: "Brasil",
    sale: "562",
    value: "$143,960",
    bounce: "32.14%",
    flag: BR,
  },
};
</script>
