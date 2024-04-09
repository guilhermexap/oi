<template>
  <div>
    <div class="tabs">
      <button
        :id="tab.name"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="setActiveTab(tab.name)"
        :class="{ 'tab-button': true, active: activeTab === tab.name }"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-for="(tab, index) in tabs" :key="index" v-show="activeTab === tab.name">
      <section>
        <slot :name="tab.name"></slot>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeTab: this.tabs[0].name,
    };
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
  },
};
</script>

<style scoped>
/* Estilos para as abas e o conteúdo */
.tabs {
  display: flex;
}

.tab-button {
  border: 1px solid transparent; /* Defina uma borda transparente por padrão */
  padding: 8px 16px;
  margin-right: 8px;
  background: transparent;
  cursor: pointer;
}

button.active {
  border-bottom-color: #000000; /* Adicione uma borda à aba ativa */
  font-weight: bold;
}

/* Adicione mais estilos conforme necessário */
</style>
