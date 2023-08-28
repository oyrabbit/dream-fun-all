<template>
  <n-layout-header class="header-back flex content-center justify-end sticky z-998 top-0 left-0 w-100% h-15 py-0">
    <el-tooltip :content="theme === 'light' ? '设置暗黑主题' : '设置明亮主题'">
      <el-button
        class="nav-btn mr-3 mt-6px"
        :shape="'circle'"
        type="info"
        plain
        :icon="theme === 'dark' ? Sunny : Moon"
        circle
        size="small"
        @click="toggleTheme()"
      />
    </el-tooltip>
    <iconpark-icon size="22" name="theme" class="mr-3" @click="skinShow = true" />
    <iconpark-icon size="22" name="setting-one" class="mr-1" @click="setShow = true" />
    <n-divider vertical title-placement="center" />
    <n-dropdown trigger="hover" :options="options" @select="handleSelect" size="large">
      <n-avatar size="medium" src="http://dream.orabbit.cn/1.jpg" round class="ml-1 mr-20px" v-if="!isLog" />
      <n-avatar size="medium" src="http://dream.orabbit.cn/4.jpg" round class="ml-1 mr-20px" v-if="isLog" />
    </n-dropdown>

    <div class="n-layout-header__border bg-#efeff5 dark:bg-#ffffff17"></div>
  </n-layout-header>
  <n-modal
    v-model:show="appStore.registerModal"
    preset="dialog"
    title="用户注册"
    @positive-click="submitCallback"
    @negative-click="cancelCallback"
  >
    <n-form ref="formRef" :model="model" :rules="rules" class="mt-20px">
      <n-form-item path="username" label="用户名">
        <n-input v-model:value="model.username" @keydown.enter.prevent placeholder="输入用户名" />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input
          v-model:value="model.password"
          type="password"
          @input="handlePasswordInput"
          @keydown.enter.prevent
          placeholder="输入密码"
        />
      </n-form-item>
      <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
        <n-input
          v-model:value="model.reenteredPassword"
          :disabled="!model.password"
          type="password"
          @keydown.enter.prevent
          placeholder="输入重复密码"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="primary" @click="cancelCallback"> 取消 </n-button>
      <n-button :disabled="model.username === null" round type="primary" @click="handleValidateButtonClick"> 立即注册 </n-button>
    </template>
  </n-modal>
  <n-modal
    v-model:show="appStore.loginModal"
    preset="dialog"
    title="用户登录"
    @positive-click="submitCallback2"
    @negative-click="cancelCallback2"
  >
    <n-form ref="formRef2" :model="model2" :rules="rules2" class="mt-20px">
      <n-form-item path="username" label="用户名">
        <n-input v-model:value="model2.username" @keydown.enter.prevent placeholder="输入用户名" />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input v-model:value="model2.password" type="password" @keydown.enter.prevent placeholder="输入密码" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-button round type="info" @click="cancelCallback2"> 没有账号？点此注册 </n-button>
      <n-button :disabled="model2.username === null" round type="info" @click="handleValidateButtonClick2"> 立即登录 </n-button>
    </template>
  </n-modal>
  <n-drawer v-model:show="setShow" :width="300">
    <n-drawer-content title="首页设置" closable>
      <div class="my-10px">首页搜索引擎</div>
      <n-select
        v-model:value="appStore.searchSetValue"
        :options="setSearchOptions"
        placeholder="选择搜索引擎"
        @update:value="handleUpdateValue"
      />
      <div class="mt-20px mb-10px">是否显示网站推荐</div>
      <n-switch v-model:value="appStore.recommendSetValue" @update:value="handleChange" :rail-style="railStyle" />
    </n-drawer-content>
  </n-drawer>
  <n-drawer v-model:show="skinShow" :width="320">
    <n-drawer-content title="皮肤设置" closable>
      <div class="mb-10px">当前皮肤</div>
      <n-image width="250" class="mb-10px" :src="appStore.skinUrl" />
      <div class="my-10px">自定义皮肤</div>
      <n-upload
        :action="API_TARGET_URL + '/upload'"
        @before-upload="beforeUpload"
        :headers="headers"
        :show-file-list="false"
        @finish="handleFinish"
        @on-error="handleError"
      >
        <n-button type="info">上传自定义图片</n-button>
      </n-upload>
      <div class="my-10px mt-20px">选择系统推荐皮肤</div>
      <img
        class="w-250px mb-10px cursor-pointer"
        :src="item.url"
        v-for="(item, index) in skinList"
        :key="index"
        @click="handleSkinClick(item.url)"
      />
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
  import { ref, h, CSSProperties } from 'vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '/@/store';
  import { Sunny, Moon } from '@element-plus/icons-vue';
  import { FormInst, FormItemInst, FormItemRule, useMessage, FormRules, NIcon, UploadFileInfo } from 'naive-ui';
  import { PersonOutline, LogOutOutline as loginIcon, Pencil as EditIcon, LogOutOutline as LogoutIcon } from '@vicons/ionicons5';
  import { register } from '/@/api/user/index';
  import { isLogin, getToken } from '/@/utils/auth';
  import { API_TARGET_URL } from '../../../build/constant';

  interface ModelType {
    username: string | null;
    password: string | null;
    reenteredPassword: string | null;
  }

  interface Model2Type {
    username: string | null;
    password: string | null;
  }

  const message = useMessage();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const theme = computed(() => {
    return appStore.theme;
  });
  const isDark = useDark({
    selector: 'body',
    onChanged(dark: boolean) {
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);

  const renderIcon = (icon: Component) => {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon),
      });
    };
  };
  const isLog = computed(() => {
    return isLogin();
  });
  const options = computed(() => {
    if (!isLogin()) {
      return [
        {
          label: '用户登录',
          key: 'login',
          icon: renderIcon(loginIcon),
        },
        {
          label: '用户注册',
          key: 'register',
          icon: renderIcon(EditIcon),
        },
      ];
    } else {
      return [
        {
          label: userStore.user_name,
          key: 'username',
          icon: renderIcon(PersonOutline),
        },
        {
          label: '退出登录',
          key: 'logout',
          icon: renderIcon(LogoutIcon),
        },
      ];
    }
  });

  const handleSelect = (key: string | number) => {
    if (key === 'register') {
      appStore.registerModal = true;
    } else if (key === 'login') {
      appStore.loginModal = true;
    } else if (key === 'logout') {
      userStore.logout();
      location.reload();
    }
  };

  const skinShow = ref(false);

  const skinList = [
    {
      url: 'https://dream.orabbit.cn/Fj3lKcsRh-vpkoP01uIbWB4BN-EB',
    },
    {
      url: 'https://dream.orabbit.cn/Fn5GEToy5DzDYtdy5VDmP0f1C23n',
    },
    {
      url: 'https://dream.orabbit.cn/Fow0Vwauh3SmWgy6wcP9p2IGEe3i',
    },
    {
      url: 'https://dream.orabbit.cn/FgbVZMcfe0iLNvx5kXenOGO-V0J0',
    },
    {
      url: 'https://dream.orabbit.cn/FvMANkRGxTzvhP9P-EwIx5iO24Pf',
    },
    {
      url: 'https://dream.orabbit.cn/FnZJ8-LDZow0qyDR1TfYyPm17ssW',
    },
    {
      url: 'https://dream.orabbit.cn/FlR9N6LXmrOOsh_wbr7681w8t-P7',
    },
  ];

  const handleSkinClick = (url: string) => {
    appStore.skinUrl = url;
  };

  const headers = { Authorization: `Bearer ${getToken()}` };

  const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(data.file.file?.type as string)) {
      message.error('只能上传png/jpg/jpeg格式的文件，请重新上传');
      return false;
    }
    return true;
  };

  const handleFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
    console.log((event?.target as XMLHttpRequest).response);
    const res = JSON.parse((event?.target as XMLHttpRequest).response);
    if (res?.status === 200) {
      appStore.skinUrl = 'https://' + res?.url;
      message.success('图片上传成功！');
    }
    return file;
  };
  const handleError = () => {
    message.error('图片上传失败！请检查网络！');
  };

  const setShow = ref(false);

  const setSearchOptions = [
    {
      label: '百度',
      value: 'baidu',
    },
    {
      label: '谷歌',
      value: 'google',
    },
    {
      label: '必应',
      value: 'bing',
    },
  ];

  const handleUpdateValue = () => {
    message.info('首页搜索引擎设置成功');
  };

  const handleChange = (value: boolean) => {
    if (value) {
      message.info(`显示网站推荐`);
    } else {
      message.info(`关闭网站推荐`);
    }
  };

  const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
    const style: CSSProperties = {};
    if (checked) {
      style.background = '#2080f0';
      if (focused) {
        style.boxShadow = '0 0 0 2px #2080f040';
      }
    }
    return style;
  };

  // 注册弹窗

  const cancelCallback = () => {
    appStore.registerModal = false;
    resetModel();
  };
  const submitCallback = () => {
    message.success('Submit');
  };

  const formRef = ref<FormInst | null>(null);
  const rPasswordFormItemRef = ref<FormItemInst | null>(null);
  const modelRef = ref<ModelType>({
    username: null,
    password: null,
    reenteredPassword: null,
  });

  const model = modelRef;

  const resetModel = () => {
    model.value.username = null;
    model.value.password = null;
    model.value.reenteredPassword = null;
  };
  const validatePasswordStartWith = (_rule: FormItemRule, value: string): boolean => {
    return !!modelRef.value.password && modelRef.value.password.startsWith(value) && modelRef.value.password.length >= value.length;
  };
  const validatePasswordSame = (_rule: FormItemRule, value: string): boolean => {
    return value === modelRef.value.password;
  };

  const handlePasswordInput = () => {
    if (modelRef.value.reenteredPassword) {
      rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
    }
  };
  const handleValidateButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        await register({
          username: model.value.username as string,
          password: model.value.password as string,
          role: 2,
        }).then((res: any) => {
          if (res?.status === 200) {
            message.success('注册成功！');
            resetModel();
            appStore.registerModal = false;
            appStore.loginModal = true;
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
    username: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入用户名');
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
    reenteredPassword: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: ['input', 'blur'],
      },
      {
        validator: validatePasswordStartWith,
        message: '两次密码输入不一致',
        trigger: 'input',
      },
      {
        validator: validatePasswordSame,
        message: '两次密码输入不一致',
        trigger: ['blur', 'password-input'],
      },
    ],
  };

  // 登录弹窗

  const cancelCallback2 = () => {
    appStore.loginModal = false;
    resetModel2();
    appStore.registerModal = true;
  };
  const submitCallback2 = () => {
    message.success('Submit');
  };

  const formRef2 = ref<FormInst | null>(null);
  const modelRef2 = ref<Model2Type>({
    username: null,
    password: null,
  });

  const model2 = modelRef2;

  const resetModel2 = () => {
    model2.value.username = null;
    model2.value.password = null;
  };

  const handleValidateButtonClick2 = (e: MouseEvent) => {
    e.preventDefault();
    formRef2.value?.validate(async (errors) => {
      if (!errors) {
        await userStore
          .login({
            username: model2.value.username as string,
            password: model2.value.password as string,
          })
          .then((res: any) => {
            if (res?.status === 200) {
              message.success('登录成功！');
              resetModel2();
              appStore.loginModal = false;
              location.reload();
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
    username: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string) {
          if (!value) {
            return new Error('请输入用户名');
          }
          return true;
        },
        trigger: ['input', 'blur'],
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  };
</script>

<style scoped lang="less">
  .header-back {
    // background: rgba(255, 255, 255, 0);
  }

  :deep(.n-divider--vertical) {
    height: unset;
    justify-content: flex-end;
  }

  .n-layout-header__border {
    content: '';
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    height: 1px;
    transition: background-color 0.3s var(--n-bezier);
  }
</style>
