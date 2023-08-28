<script setup lang="ts">
  import { h, ref, defineAsyncComponent, onMounted } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import type { MenuOption } from 'naive-ui';
  import { useAppStore } from '/@/store';
  import { darkTheme, NConfigProvider, GlobalThemeOverrides } from 'naive-ui';
  import Header from '/@/layout/components/header.vue';
  import { getAllCate } from '/@/api/home/index';
  import logo from '/@/assets/logo.png';
  import logoLight from '/@/assets/logo-light.png';
  import logoMini from '/@/assets/logo-mini.png';

  const Main = defineAsyncComponent(() => import('/@/layout/components/main.vue'));

  const route = useRoute();

  // 设置主题
  const appStore = useAppStore();
  const theme = computed(() => {
    return appStore.theme;
  });

  // 是否折叠
  const collapsed = computed(() => {
    return appStore.collapsed;
  });
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      primaryColor: '#2672fe',
    },
  };
  const themeMenu = computed(() => {
    return appStore.theme === 'dark' ? darkTheme : null;
  });

  // 菜单栏图标处理
  const renderIcon = (icon: string) => {
    return () =>
      h('iconpark-icon', {
        size: 22,
        name: icon,
      });
  };

  // 菜单栏标签处理
  const allCateData: Ref<any[]> = ref([]);
  const selectedValue = computed(() => {
    let result: any = '';
    const fName = allCateData.value.find((item: any) => item?.f_id === Number(route.query?.fid))?.f_name;
    if (fName) {
      result = fName + route.query?.fid;
    } else {
      result = route.name;
    }
    return result;
  });
  // 菜单数据
  const menuOptions: Ref<MenuOption[]> = ref([
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'home',
            },
          },
          { default: () => '首页' },
        ),
      key: 'home',
      icon: renderIcon('home'),
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'custom',
            },
          },
          { default: () => '自定义网站' },
        ),
      key: 'custom',
      icon: renderIcon('file-editing-one'),
    },
  ]);

  // 获取菜单数据
  const getMenuData = async () => {
    await getAllCate().then((res) => {
      const data = res?.data;
      allCateData.value = data;
      // 获取所有大分类
      const fCates = data?.filter((item: any, index) => data.findIndex((item1: any) => item?.f_id === item1?.f_id) === index);

      fCates.forEach(async (item: any) => {
        // 获取当前大分类中的小分类
        // const childrenCates = data
        //   ?.filter((item1: any) => item?.f_id === item1?.f_id)
        //   .map((item3: any) => {
        //     return {
        //       label: () =>
        //         h(
        //           RouterLink,
        //           {
        //             to: {
        //               name: 'default',
        //               query: {
        //                 fid: item?.f_id,
        //               },
        //             },
        //           },
        //           { default: () => item3.name },
        //         ),
        //       key: item3.name + item3.id,
        //     };
        //   });

        menuOptions.value.push({
          // label: item?.f_name,
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: 'default',
                  query: {
                    fid: item?.f_id,
                  },
                },
              },
              { default: () => item?.f_name },
            ),
          key: item?.f_name + item?.f_id,
          icon: await renderIcon(item?.f_icon),
          // children: childrenCates,
        });
      });
    });
  };

  onMounted(() => {
    getMenuData();
  });

  // const handleUpdateValue = (key: string, item: MenuOption) => {
  //   message.info('[onUpdate:value]: ' + JSON.stringify(key));
  //   message.info('[onUpdate:value]: ' + JSON.stringify(item));
  // };

  // logo展示控制
  const logoShow = computed(() => {
    if (theme.value === 'light') {
      return logo;
    } else {
      return logoLight;
    }
  });
</script>

<template>
  <n-config-provider :theme="themeMenu" :theme-overrides="themeOverrides">
    <n-space vertical>
      <n-layout has-sider class="w-screen h-screen dark:shadow-md" shadow="[4px_0_25px_0_#f3f3f3]">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="appStore.collapsed = true"
          @expand="appStore.collapsed = false"
        >
          <div class="flex justify-center items-center w-100%">
            <img :src="logoShow" class="w-52 h-31" alt="" v-if="collapsed === false" />
            <img :src="logoMini" class="w-50px h-50px mt-5px" alt="" v-if="collapsed === true" />
          </div>
          <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" :value="selectedValue" />
        </n-layout-sider>
        <n-layout class="layout bg-#f0f0f0 dark:bg-#000000">
          <Header />
          <Main />
          <n-back-top :right="30" />
        </n-layout>
      </n-layout>
    </n-space>
  </n-config-provider>
</template>

<style scoped lang="less"></style>
