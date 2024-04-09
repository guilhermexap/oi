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
        <div class="row">
          <div class="col-lg-12 mb-lg">
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
          </div>
        </div>
        <div class="row mt-4">
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
        </div>
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
