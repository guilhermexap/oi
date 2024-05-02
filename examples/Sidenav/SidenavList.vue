<template>
  <div
    id="sidenav-collapse-main"
    class="collapse navbar-collapse w-auto h-auto h-100"
  >
    <ul class="navbar-nav">
      <li class="nav-item d-flex align-items-center px-2 mx-4">
        <i class="ni ni-shop text-primary text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="H" text="Home" />
      </li>
      <li class="nav-item d-flex align-items-center px-2 mx-4">
        <i class="ni ni-settings-gear-65 text-primary text-sm opacity-10"></i>
        <SidenavItem to="/configuracoes" mini-icon="C" text="Configurações" />
      </li>

      <!-- <li class="nav-item d-flex align-items-center px-2 mx-4">
        <i class="ni ni-collection text-primary text-sm opacity-10"></i>
        <SidenavItem to="/space-reservation" text="Reserva de Espaços" />
      </li>

      <li class="nav-item d-flex align-items-center px-2 mx-4">
        <i class="ni ni-calendar-grid-58 text-primary text-sm opacity-10"></i>
        <SidenavItem to="/timesheet" text="Quadro de Horários" />
      </li> -->
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="apiExamples"
          nav-text="Comunicação"
          :class="getRoute === 'examples' ? 'active' : ''"
        >
          <template #icon>
            <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavItem
                to="/announcements"
                mini-icon="C"
                text="Comunicados"
              />
              <SidenavItem to="/marketing" mini-icon="M" text="Marketing" />
              <SidenavItem to="/events" mini-icon="E" text="Eventos" />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="apiExamples"
          nav-text="Usuarios App"
          :class="getRoute === 'examples' ? 'active' : ''"
        >
          <template #icon>
            <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavItem
                to="/users/member-users"
                mini-icon="U"
                text="Usuarios Membros"
              />
              <SidenavItem
                to="/users/request-users"
                mini-icon="S"
                text="Solicitações de Usuários"
              />
              <SidenavItem
                to="/users/follower-users"
                mini-icon="U"
                text="Usuarios Seguidores"
              />
              <SidenavItem
                to="/users/pre-registro"
                mini-icon="P"
                text="Pré-registro de usuários"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="apiExamples"
          nav-text="Tipos de Usuarios"
          :class="getRoute === 'examples' ? 'active' : ''"
        >
          <template #icon>
            <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavItem
                to="/users/groups/members"
                mini-icon="M"
                text="Membro"
              />
              <SidenavItem
                to="/users/groups/followers"
                mini-icon="S"
                text="Seguidor"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="apiExamples"
          nav-text="Serviços"
          :class="getRoute === 'examples' ? 'active' : ''"
        >
          <template #icon>
            <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavItem
                to="/services/timesheet"
                mini-icon="Q"
                text="Quadro de Horários"
              />
              <SidenavItem
                to="/services/space-reservation"
                mini-icon="R"
                text="Reserva de Espaços"
              />
              <SidenavItem
                to="/services/professional-reservation"
                mini-icon="R"
                text="Reserva de Profissionais"
              />
              <SidenavItem to="/services/spaces" mini-icon="E" text="Espaços" />
              <SidenavItem
                to="/services/appmenu"
                mini-icon="M"
                text="Montagem menu serviços app"
              />
              <SidenavItem
                to="/services/schedule"
                mini-icon="A"
                text="Agenda"
              />
              <SidenavItem
                to="/services/schedule/operational"
                mini-icon="O"
                text="Operacional"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <!-- <li class="nav-item d-flex align-items-center px-2">
        <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="C" text="Comunicados" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="A" text="Agenda" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="E" text="Eventos" />
      </li>
      <li class="nav-item">
        <sidenav-collapse collapse-ref="apiExamples" nav-text="Servicos"
          :class="getRoute === 'examples' ? 'active' : ''">
          <template #icon>
            <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavItem to="/dashboards/default" mini-icon="A" text="Acompanhamento" />
              <SidenavItem to="/dashboards/default" mini-icon="R" text="Registro de servicos" />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="A" text="Atendimento" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="P" text="Pesquisa de satisfacao" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="U" text="Unidades" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="F" text="Fornecedores" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="L" text="Lojas" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
        <SidenavItem to="/dashboards/default" mini-icon="P" text="Parametrizacao" />
      </li> -->
      <!-- EXEMPLOS -->
      <!-- <li class="nav-item">
        <sidenav-collapse collapse-ref="apiExamples" nav-text="Examples (API)"
          :class="getRoute === 'examples' ? 'active' : ''">
          <template #icon>
            <i class="fab fa-vuejs text-success text-sm opacity-10"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavItem to="/examples/user-profile" mini-icon="U" text="User Profile" />
              <SidenavItem to="/examples/user-management/list-users" mini-icon="U" text="User Management" />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
        <SidenavItem to="/pages/charts" mini-icon="C" text="Charts" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-align-left-2 text-info text-sm opacity-10"></i>
        <SidenavItem to="/applications/data-tables" mini-icon="D" text="Data Tables" />
      </li>
      <li class="nav-item d-flex align-items-center px-2">
        <i class="ni ni-ungroup text-success text-sm opacity-10"></i>
        <SidenavItem to="/pages/widgets" mini-icon="W" text="Widgets" />
      </li>
      
      <li class="mt-3 nav-item">
        <hr class="mt-0 horizontal dark" />
        <h6
          class="text-xs ps-4 ms-2 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          DOCS
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="basicExamples"
          nav-text="Basic"
          :class="getRoute === 'basic' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-spaceship text-sm" :class="sidenavType"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <SidenavCollapseItem
                refer="gettingStartedExample"
                mini-icon="G"
                text="Getting Started"
              >
                <template #nav-child-item>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/quick-start/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">Q</span>
                      <span class="sidenav-normal">Quick Start</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/license/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">L</span>
                      <span class="sidenav-normal">License</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">C</span>
                      <span class="sidenav-normal">Contents</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/build-tools/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">B</span>
                      <span class="sidenav-normal">Build Tools</span>
                    </a>
                  </li>
                </template>
              </SidenavCollapseItem>

              <SidenavCollapseItem
                refer="foundationExample"
                mini-icon="F"
                text="Foundation"
              >
                <template #nav-child-item>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/colors/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">C</span>
                      <span class="sidenav-normal">Colors</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/grid/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">G</span>
                      <span class="sidenav-normal">Grid</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/typography/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">T</span>
                      <span class="sidenav-normal">Typography</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/vue/icons/argon-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">I</span>
                      <span class="sidenav-normal">Icons</span>
                    </a>
                  </li>
                </template>
              </SidenavCollapseItem>
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="componentsExamples"
          nav-text="Components"
          :class="getRoute === 'components' ? 'active' : ''"
        >
          <template #icon>
            <i class="ni ni-app text-sm" :class="sidenavType"></i>
          </template>
          <template #list>
            <ul class="nav ms-4">
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/alerts/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">A</span>
                  <span class="sidenav-normal">Alerts</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/Avatar/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">A</span>
                  <span class="sidenav-normal">Avatar</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/badge/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">B</span>
                  <span class="sidenav-normal">Badge</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/buttons/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">B</span>
                  <span class="sidenav-normal">Buttons</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/input/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">I</span>
                  <span class="sidenav-normal">Input</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/checkbox/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Checkbox</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/pagination/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Pagination</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/progress/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Progress</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/progress/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Progress</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/snackbar/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">S</span>
                  <span class="sidenav-normal">Snackbar</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/vue/snackbar/argon-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">S</span>
                  <span class="sidenav-normal">Social Button</span>
                </a>
              </li>
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          nav-text="Changelog"
          :collapse="false"
          url="#"
          :aria-controls="''"
          collapse-ref="https://github.com/creativetimofficial/ct-vue-argon-dashboard-pro/blob/main/CHANGELOG.md"
        >
          <template icon>
            <i class="ni ni-align-left-2 text-sm" :class="sidenavType"></i>
          </template>
        </sidenav-collapse>
      </li> -->
    </ul>
    <div class="mt-3 sidenav-footer">
      <SidenavCard
        :card="{
          title: 'Precisa de Ajuda?',
          description: 'Verifique nossa documentação',
          links: [
            {
              label: 'Documentação',
              route: '/',
              color: 'dark',
            },
            {
              label: 'Indique o Xappa',
              route: '/',
              color: 'success',
            },
          ],
        }"
      />
    </div>
  </div>
</template>
<script setup>
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCollapseItem from "./SidenavCollapseItem.vue";
import SidenavCard from "./SidenavCard.vue";
import SidenavItem from "./SidenavItem.vue";
import { useNavStore } from "~~/stores/NavStore";
const navStore = useNavStore();

const sidenavType = computed(() => {
  return navStore.sidenavType === "bg-white" ? "text-dark" : "text-white";
});
const getRoute = computed(() => {
  const route = useRoute();
  return route.path.split("/")[1];
});
defineProps({
  isRTL: {
    type: Boolean,
    default: false,
  },
});
</script>
