<script setup lang="ts">
  import {
    getUserWebsite,
    getUserCategory,
    editCustomCate,
    deleteCustomCate,
    addCustomCate,
    addCustomWebsite,
    editCustomWebsite,
    delCustomWebsite,
  } from '/@/api/home/index';
  import { FormInst, FormItemRule, useMessage, FormRules } from 'naive-ui';
  import { useAppStore, useUserStore } from '/@/store';
  import { isLogin } from '/@/utils/auth';

  interface Model1Type {
    id: number | null;
    name: string | null;
  }
  interface Model2Type {
    id: number | null;
    name: string | null;
  }

  interface Model4Type {
    id: number | null;
    name: string | null;
    url: string | null;
  }

  interface Model5Type {
    id: number | null;
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

  const isEmptyShow = ref(false);

  // 渲染分类和网站数据
  const cateList = ref<any>([]);
  const websitesData = ref<any>([]);
  const getCustomWebsiteData = async () => {
    await getUserCategory().then(async (res) => {
      const data = res?.data;
      cateList.value = data?.map((item: any) => {
        return { id: item?.id, name: item?.name };
      });
      isEmptyShow.value = !cateList.value?.length;
    });
    await getUserWebsite().then((res1) => {
      websitesData.value = res1?.data;
    });
  };
  onMounted(() => {
    getCustomWebsiteData();
  });
  const websiteData = computed(() => {
    const websiteDataTemp: any[] = [];
    // 建立树形结构
    cateList.value?.forEach((item: any) => {
      websiteDataTemp.push({
        id: item?.id,
        name: item?.name,
        websites: websitesData.value
          ?.filter((item1: any) => item1?.user_category_id === item?.id)
          ?.map((item1: any) => {
            return {
              id: item1?.user_website_id,
              name: item1?.user_website_name,
              url: item1?.user_website_url,
            };
          }),
      });
    });
    return websiteDataTemp;
  });

  // 编辑模式和删除模式控制
  const isEdit = ref(false);
  const isDel = ref(false);

  // 编辑分类弹窗
  const showModal1 = ref(false);

  const cancelCallback1 = () => {
    showModal1.value = false;
    resetModel1();
  };

  const formRef1 = ref<FormInst | null>(null);
  const modelRef1 = ref<Model1Type>({
    id: null,
    name: null,
  });

  const model1 = modelRef1;

  const resetModel1 = () => {
    model1.value.id = null;
    model1.value.name = null;
  };

  const handleValidateButtonClick1 = (e: MouseEvent) => {
    e.preventDefault();
    formRef1.value?.validate(async (errors) => {
      if (!errors) {
        await editCustomCate(model1.value.id as number, { name: model1.value.name }).then((res: any) => {
          if (res?.status === 200) {
            message.success('修改成功！');
            resetModel1();
            showModal1.value = false;
            getCustomWebsiteData();
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
  const rules1: FormRules = {
    name: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入分类名称');
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    ],
  };

  // 添加分类弹窗
  const showModal2 = ref(false);

  const cancelCallback2 = () => {
    showModal2.value = false;
    resetModel2();
  };

  const formRef2 = ref<FormInst | null>(null);
  const modelRef2 = ref<Model2Type>({
    id: null,
    name: null,
  });

  const model2 = modelRef2;

  const resetModel2 = () => {
    model2.value.id = null;
    model2.value.name = null;
  };

  const handleValidateButtonClick2 = (e: MouseEvent) => {
    e.preventDefault();
    formRef2.value?.validate(async (errors) => {
      if (!errors) {
        await addCustomCate(userStore.user_name as string, { name: model2.value.name, user_id: userStore.user_id }).then((res: any) => {
          if (res?.status === 200) {
            message.success('添加成功！');
            resetModel2();
            showModal2.value = false;
            getCustomWebsiteData();
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
  const rules2: FormRules = {
    name: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入分类名称');
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    ],
  };

  const showModal3 = ref(false);
  const delId = ref<number | null>(null);
  const delCancelCallback = () => {
    delId.value = null;
  };
  const delSubmitCallback = async () => {
    await deleteCustomCate(delId.value as number).then((res: any) => {
      if (res?.status === 200) {
        message.success('删除分类成功！');
        getCustomWebsiteData();
      } else {
        message.error(res?.message);
      }
    });
  };

  // 添加网站弹窗
  const showModal4 = ref(false);

  const cancelCallback4 = () => {
    showModal4.value = false;
    resetModel4();
  };

  const formRef4 = ref<FormInst | null>(null);
  const modelRef4 = ref<Model4Type>({
    id: null,
    name: null,
    url: null,
  });

  const model4 = modelRef4;

  const resetModel4 = () => {
    model4.value.id = null;
    model4.value.name = null;
    model4.value.url = null;
  };

  const handleValidateButtonClick4 = (e: MouseEvent) => {
    e.preventDefault();
    formRef4.value?.validate(async (errors) => {
      if (!errors) {
        await addCustomWebsite(userStore.user_name as string, {
          name: model4.value.name,
          url: model4.value.url,
          category_id: model4.value.id,
        }).then((res: any) => {
          if (res?.status === 200) {
            message.success('添加成功！');
            resetModel4();
            showModal4.value = false;
            getCustomWebsiteData();
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
  const rules4: FormRules = {
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

  // 修改网站弹窗
  const showModal5 = ref(false);

  const cancelCallback5 = () => {
    showModal5.value = false;
    resetModel5();
  };

  const formRef5 = ref<FormInst | null>(null);
  const modelRef5 = ref<Model5Type>({
    id: null,
    cid: null,
    name: null,
    url: null,
  });

  const model5 = modelRef5;

  const resetModel5 = () => {
    model5.value.id = null;
    model5.value.cid = null;
    model5.value.name = null;
    model5.value.url = null;
  };

  const handleValidateButtonClick5 = (e: MouseEvent) => {
    e.preventDefault();
    formRef5.value?.validate(async (errors) => {
      if (!errors) {
        await editCustomWebsite(model5.value.id as number, userStore.user_name as string, {
          name: model5.value.name,
          url: model5.value.url,
          category_id: model5.value.cid,
        }).then((res: any) => {
          if (res?.status === 200) {
            message.success('修改成功！');
            resetModel5();
            showModal5.value = false;
            getCustomWebsiteData();
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
  const rules5: FormRules = {
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

  // 删除网站弹窗
  const showModal6 = ref(false);
  const delWebsiteId = ref<number | null>(null);
  const delWebsiteCancelCallback = () => {
    delWebsiteId.value = null;
  };
  const delWebsiteSubmitCallback = async () => {
    await delCustomWebsite(delWebsiteId.value as number, userStore.user_name as string).then((res: any) => {
      if (res?.status === 200) {
        message.success('删除网站成功！');
        getCustomWebsiteData();
      } else {
        message.error(res?.message);
      }
    });
  };

  // 处理网站点击事件
  const handleClick = (info: any, item: any) => {
    // 正常访问
    if (!isEdit.value && !isDel.value) {
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
      // 编辑模式
    } else if (isEdit.value) {
      handleWebsiteEdit({ ...info, cid: item?.id });
      // 删除模式
    } else if (isDel.value) {
      handleWebsiteDel(info?.id);
    }
  };
  // 处理点击事件
  const handleCateEdit = ({ id, name }) => {
    showModal1.value = true;
    model1.value.id = id;
    model1.value.name = name;
  };
  const handleCateAdd = () => {
    showModal2.value = true;
  };
  const handleCateDel = (id: number) => {
    showModal3.value = true;
    delId.value = id;
  };
  const handleWebsiteAdd = (id: number) => {
    showModal4.value = true;
    model4.value.id = id;
  };
  const handleWebsiteEdit = ({ id, cid, name, url }) => {
    showModal5.value = true;
    model5.value.id = id;
    model5.value.cid = cid;
    model5.value.name = name;
    model5.value.url = url;
  };
  const handleWebsiteDel = (id: number) => {
    showModal6.value = true;
    delWebsiteId.value = id;
  };

  const handelDelBtn = () => {
    isDel.value = !isDel.value;
    isEdit.value = false;
    isDel.value && message.info('进入删除模式');
    !isDel.value && message.info('退出删除模式');
    console.log(isDel.value, 777);
  };
  const handelEditBtn = () => {
    isEdit.value = !isEdit.value;
    isDel.value = false;
    isEdit.value && message.info('进入编辑模式');
    !isEdit.value && message.info('退出编辑模式');
  };

  const handleNodataClick = () => {
    if (!isLogin()) {
      appStore.loginModal = true;
    } else {
      handleCateAdd();
    }
  };
</script>

<template>
  <div class="custom w-100% h-100% px-20px py-20px">
    <div class="w-100% flex justify-end" v-if="websiteData?.length">
      <n-button class="mr-20px mb-15px" type="info" @click="handelDelBtn"> {{ isDel ? '退出删除' : '删除模式' }}</n-button>
      <n-button class="mb-15px" type="info" @click="handelEditBtn"> {{ isEdit ? '退出编辑' : '编辑模式' }}</n-button>
    </div>
    <n-empty description="再怎么找也没有啦" size="large" class="mt-250px" v-if="isEmptyShow">
      <template #extra>
        <n-button size="large" type="info" @click="handleNodataClick"> 点击这里添加分类 </n-button>
      </template>
    </n-empty>
    <div class="mb-20px px-15px py-10px bg-white dark:bg-#18181c" border-rd="[10px]" v-for="item in websiteData" :key="item.id">
      <div class="flex justify-between h-22px">
        <n-ellipsis style="max-width: 500px" class="text-16px font-600">{{ item?.name }}</n-ellipsis>
        <div>
          <iconpark-icon size="22" name="delete" class="ml-6px cursor-pointer" v-if="isDel" @click="handleCateDel(item?.id)" />
          <iconpark-icon size="22" name="file-addition" class="ml-10px cursor-pointer" v-if="isEdit" @click="handleWebsiteAdd(item?.id)" />
          <iconpark-icon size="22" name="add" class="ml-10px cursor-pointer" v-if="isEdit" @click="handleCateAdd" />
          <iconpark-icon
            size="22"
            name="file-editing-one"
            class="ml-10px cursor-pointer"
            v-if="isEdit"
            @click="handleCateEdit({ id: item?.id, name: item?.name })"
          />
        </div>
      </div>

      <div class="website-list px-20px py-15px pt-20px">
        <div class="h-36px lh-36px whitespace-nowrap op-60" v-if="!item?.websites?.length"
          >该分类下暂无网站，请进入编辑模式后，点击该分类卡片右上角添加网站。</div
        >
        <div
          :class="{
            'website-box': true,
            'light-box': theme !== 'dark',
            'dark-box': theme === 'dark',
          }"
          border-rd="[10px]"
          v-for="item1 in item?.websites"
          :key="item1?.id"
          @click="handleClick(item1, item)"
        >
          <div class="w-22px h-22px mr-10px">
            <img class="w-100%" border-rd="[50%]" :src="appStore.icoUrl + item1?.url + '.png'" alt="" />
          </div>

          <n-ellipsis
            style="max-width: 120px"
            class="w-120px text-14px whitespace-nowrap overflow-hidden text-ellipsis"
            v-if="isEdit || isDel"
            >{{ item1?.name }}</n-ellipsis
          >
          <n-ellipsis style="max-width: 142px" class="w-142px text-14px whitespace-nowrap overflow-hidden text-ellipsis" v-else>{{
            item1?.name
          }}</n-ellipsis>

          <iconpark-icon size="22" name="file-editing-one" class="" v-if="isEdit" />
          <iconpark-icon size="22" name="delete" class="" v-if="isDel" />
        </div>
      </div>
    </div>
  </div>

  <!-- 修改分类弹窗 -->
  <n-modal v-model:show="showModal1" preset="dialog" title="修改分类" @negative-click="cancelCallback1">
    <n-form ref="formRef1" :model="model1" :rules="rules1" class="mt-20px">
      <n-form-item path="name" label="分类名称">
        <n-input v-model:value="model1.name" @keydown.enter.prevent placeholder="输入分类名称" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="info" @click="cancelCallback1"> 算了 </n-button>
      <n-button :disabled="model1.name === null" round type="info" @click="handleValidateButtonClick1"> 立即修改 </n-button>
    </template>
  </n-modal>
  <n-modal v-model:show="showModal2" preset="dialog" title="添加分类" @negative-click="cancelCallback2">
    <n-form ref="formRef2" :model="model2" :rules="rules2" class="mt-20px">
      <n-form-item path="name" label="分类名称">
        <n-input v-model:value="model2.name" @keydown.enter.prevent placeholder="输入分类名称" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="info" @click="cancelCallback2"> 算了 </n-button>
      <n-button :disabled="model2.name === null" round type="info" @click="handleValidateButtonClick2"> 立即添加 </n-button>
    </template>
  </n-modal>

  <!-- 删除分类弹窗 -->
  <n-modal
    v-model:show="showModal3"
    preset="dialog"
    title="删除分类"
    content="确认要删该分类（包括该分类下的所有网站）？"
    positive-text="确认"
    negative-text="算了"
    @positive-click="delSubmitCallback"
    @negative-click="delCancelCallback"
  />

  <!-- 添加网站弹窗 -->
  <n-modal v-model:show="showModal4" preset="dialog" title="添加网站" @negative-click="cancelCallback4">
    <n-form ref="formRef4" :model="model4" :rules="rules4" class="mt-20px">
      <n-form-item path="name" label="网站名称">
        <n-input v-model:value="model4.name" @keydown.enter.prevent placeholder="输入网站名称" />
      </n-form-item>
      <n-form-item path="url" label="网站地址（不带http://）">
        <n-input v-model:value="model4.url" @keydown.enter.prevent placeholder="输入网站地址" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="info" @click="cancelCallback4"> 算了 </n-button>
      <n-button :disabled="model4.name === null" round type="info" @click="handleValidateButtonClick4"> 立即添加 </n-button>
    </template>
  </n-modal>
  <n-modal v-model:show="showModal5" preset="dialog" title="编辑网站" @negative-click="cancelCallback5">
    <n-form ref="formRef5" :model="model5" :rules="rules5" class="mt-20px">
      <n-form-item path="name" label="网站名称">
        <n-input v-model:value="model5.name" @keydown.enter.prevent placeholder="输入网站名称" />
      </n-form-item>
      <n-form-item path="url" label="网站地址（不带http://）">
        <n-input v-model:value="model5.url" @keydown.enter.prevent placeholder="输入网站地址" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="info" @click="cancelCallback5"> 算了 </n-button>
      <n-button :disabled="model5.name === null" round type="info" @click="handleValidateButtonClick5"> 立即编辑 </n-button>
    </template>
  </n-modal>
  <n-modal
    v-model:show="showModal6"
    preset="dialog"
    title="删除网站"
    content="确认要删该网站吗？"
    positive-text="确认"
    negative-text="算了"
    @positive-click="delWebsiteSubmitCallback"
    @negative-click="delWebsiteCancelCallback"
  />
</template>

<style scoped lang="less">
  .custom {
    position: relative;
    // background-image: v-bind(back);
    // background-repeat: no-repeat;
    // background-position: center;
  }

  .website-box {
    display: flex;
    align-items: center;
    width: 190px;
    height: 36px;
    padding: 0 0 0 10px;
    cursor: pointer;
    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
  }

  .dark-box {
    // box-shadow: 0 0 14px 2px #313131;
    // border: 1px solid rgb(46 46 46);

    &:hover {
      background-color: #212121;
    }
  }

  .light-box {
    // box-shadow: 0 0 14px 2px #e5e5e5;
    // border: 1px solid rgb(225 225 225);

    &:hover {
      background-color: #e2e2e2;
    }
  }

  .website-list {
    display: grid;
    grid-gap: 25px 8px;
    grid-template-columns: repeat(auto-fill, 190px);
  }
</style>
