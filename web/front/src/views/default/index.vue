<script setup lang="ts">
  import { watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { getDefaultWebsite, getUserCategory, addCustomWebsite } from '/@/api/home/index';
  import { FormInst, FormItemRule, useMessage, FormRules } from 'naive-ui';
  import { useAppStore, useUserStore } from '/@/store';
  import { isLogin } from '/@/utils/auth';

  interface ModelType {
    cid: number | null;
    name: string | null;
    url: string | null;
  }

  const appStore = useAppStore();
  const userStore = useUserStore();
  const message = useMessage();
  const theme = computed(() => {
    return appStore.theme;
  });

  const route = useRoute();
  // const back = 'url(' + img1 + ')';

  const websiteData: Ref<any> = ref([]);

  const getDefaultWebsiteData = async (fid: number) => {
    await getDefaultWebsite(fid).then((res) => {
      const data = res?.data;
      const websiteDataTemp: any[] = [];
      // 获取所有分类
      const cates = data
        ?.filter((item: any, index: number) => data.findIndex((item1: any) => item?.category_id === item1?.category_id) === index)
        .map((item: any) => {
          return { id: item?.category_id, name: item?.category_name };
        });

      // 建立树形结构
      cates?.forEach((item: any) => {
        websiteDataTemp.push({
          id: item?.id,
          category: item?.name,
          websites: data
            ?.filter((item1: any) => item1?.category_id === item?.id)
            .map((item1: any) => {
              return {
                id: item1?.website_id,
                name: item1?.website_name,
                url: item1?.website_url,
                description: item1?.website_description,
              };
            }),
        });
      });
      websiteData.value = websiteDataTemp;
    });

    await getUserCategory().then(async (res) => {
      const data = res?.data;
      generalOptions.value = data.map((item: any) => {
        return { value: item?.id, label: item?.name };
      });
      console.log(generalOptions.value);
    });
  };

  const handleClick = (info: any) => {
    appStore.lastWebsite = {
      name: info.name,
      url: info.url,
    };
    if (!appStore.recommendWebsites.find((item: any) => item?.name === info.name)) {
      appStore.recommendWebsites.push({
        name: info.name,
        url: info.url,
        count: 1,
      });
    } else {
      appStore.recommendWebsites[appStore.recommendWebsites.findIndex((item: any) => item?.name === info.name)].count += 1;
    }
    window.open('http://' + info.url, '_blank');
  };

  const handelLoveClick = (item1: any) => {
    showModal.value = true;
    model.value.name = item1.name;
    model.value.url = item1.url;
  };

  // 修改网站弹窗
  const showModal = ref(false);

  const cancelCallback = () => {
    showModal.value = false;
    resetModel();
  };

  const formRef = ref<FormInst | null>(null);
  const modelRef = ref<ModelType>({
    cid: null,
    name: null,
    url: null,
  });

  const model = modelRef;

  const resetModel = () => {
    model.value.cid = null;
    model.value.name = null;
    model.value.url = null;
  };

  const handleValidateButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        await addCustomWebsite(userStore.user_name as string, {
          name: model.value.name,
          url: model.value.url,
          category_id: model.value.cid,
        }).then((res: any) => {
          if (res?.status === 200) {
            message.success('收藏成功！');
            resetModel();
            showModal.value = false;
          } else {
            message.error(res?.message);
          }
        });
      } else {
        console.log(errors);
        message.error('验证失败');
      }
    });
  };
  const rules: FormRules = {
    name: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入网站名称');
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    ],
    url: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入网站地址');
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    ],
  };
  const generalOptions = ref([]);
  watchEffect(() => {
    getDefaultWebsiteData(Number(route.query.fid));
  });
</script>

<template>
  <div class="default w-100% h-100% px-20px py-20px">
    <div class="mb-20px px-15px py-10px bg-white dark:bg-#18181c" border-rd="[10px]" v-for="item in websiteData" :key="item.id">
      <n-ellipsis style="max-width: 500px" class="text-16px font-600">{{ item.category }}</n-ellipsis>
      <div class="website-list px-20px py-15px">
        <div
          :class="{
            'website-box': true,
            'light-box': theme !== 'dark',
            'dark-box': theme === 'dark',
          }"
          border-rd="[10px]"
          v-for="item1 in item.websites"
          :key="item1.id"
          @click="handleClick(item1)"
        >
          <div class="w-45px h-45px mr-12px px-10px py-10px">
            <img class="w-100%" border-rd="[10px]" :src="appStore.icoUrl + item1.url + '.png'" alt="" />
          </div>
          <div class="w-140px">
            <n-ellipsis class="w-130px text-14px">{{ item1.name }}</n-ellipsis>
            <n-ellipsis class="w-140px text-10px" text="[#888888]">{{ item1.description }}</n-ellipsis>
          </div>
          <iconpark-icon
            size="22"
            name="like"
            class="love"
            fill="#e95e5e"
            color="#e95e5e"
            v-if="isLogin()"
            @click.stop="handelLoveClick(item1)"
          />
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showModal" preset="dialog" title="收藏网站" @negative-click="cancelCallback">
    <n-form ref="formRef" :model="model" :rules="rules" class="mt-20px">
      <n-form-item path="name" label="网站名称">
        <n-input v-model:value="model.name" @keydown.enter.prevent placeholder="输入网站名称" />
      </n-form-item>
      <n-form-item path="url" label="网站地址（不带http://）">
        <n-input v-model:value="model.url" @keydown.enter.prevent placeholder="输入网站地址" />
      </n-form-item>
      <n-form-item path="cid" label="目标分类">
        <n-select v-model:value="model.cid" placeholder="请选择分类" :options="generalOptions" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="primary" @click="cancelCallback"> 算了 </n-button>
      <n-button :disabled="model.name === null" round type="primary" @click="handleValidateButtonClick"> 立即收藏 </n-button>
    </template>
  </n-modal>
</template>

<style scoped lang="less">
  .default {
    position: relative;
    // background-image: v-bind(back);
    // background-repeat: no-repeat;
    // background-position: center;
  }

  .website-box {
    display: flex;
    align-items: center;
    position: relative;
    width: 238px;
    height: 68px;
    padding: 0 5px 0 15px;
    cursor: pointer;

    .love {
      display: none;
    }

    &:hover .love {
      display: inline-block;
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }

  .dark-box {
    box-shadow: 0 0 14px 2px #313131;
    border: 1px solid rgb(46 46 46);
    color: #fff;
    // color: #e95e5e;

    &:hover {
      background-color: #212121;
    }
  }

  .light-box {
    box-shadow: 0 0 14px 2px #e5e5e5;
    border: 1px solid rgb(225 225 225);

    &:hover {
      background-color: #e2e2e2;
    }
  }

  .website-list {
    display: grid;
    grid-gap: 25px 50px;
    grid-template-columns: repeat(auto-fill, 210px);
  }
</style>
