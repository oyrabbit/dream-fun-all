<template>
  <div class="index flex flex-col items-center w-100% dark:text-slate-400">
    <div class="search-container">
      <div class="search-box bg-#f8f8f8">
        <div class="left-icon">
          <iconpark-icon size="28" :name="searchWayList[appStore.searchSetValue]?.icon" />
        </div>
        <input v-model="searchValue" type="text" placeholder="请输入搜索内容" @keyup.enter="handleSearch" />
        <div class="right-icon" @click="handleSearch">
          <iconpark-icon size="32" name="search" />
        </div>
      </div>
    </div>
    <div class="website-recommend" v-if="appStore.recommendSetValue">
      <div class="website-item" v-for="(item, index) in recommendWebsites" :key="index" @click="handleClick(item)">
        <div class="website-box"><img :src="appStore.icoUrl + item.url + '.png'" alt="" /> </div>
        <div class="website-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAppStore } from '/@/store';
  import { close } from '/@/utils/nprogress';

  const appStore = useAppStore();

  const back = computed(() => 'url(' + appStore.skinUrl + ')');

  const searchWayList = {
    baidu: {
      key: 'baidu',
      icon: 'baidu',
      url: 'https://www.baidu.com/s?wd=',
    },
    google: {
      key: 'google',
      icon: 'google',
      url: 'https://www.google.com/search?q=',
    },
    bing: {
      key: 'bing',
      icon: 'Bing',
      url: 'https://www.bing.com/search?q=',
    },
  };

  const searchValue = ref('');

  const handleSearch = () => {
    window.open(searchWayList[appStore.searchSetValue]?.url + searchValue.value, '_blank');
  };

  const recommendWebsites = computed(() => {
    const lastWebsite = appStore.lastWebsite;
    const recommendWebsites = appStore.recommendWebsites
      .filter((item: any) => item.name !== lastWebsite.name)
      .sort((a: any, b: any) => b.count - a.count)
      .map((item: any) => {
        return {
          name: item.name,
          url: item.url,
        };
      })
      .filter((_item, index: number) => index < 7);

    return [lastWebsite, ...recommendWebsites];
  });

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
  onMounted(() => {
    close();
  });
</script>

<style lang="less" scoped>
  .index {
    position: relative;
    height: calc(100vh - 60px) !important;
    background-image: v-bind(back);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    // background-attachment: fixed;
  }

  .search-container {
    width: 750px;
    position: absolute;
    top: 200px;

    .search-box {
      display: flex;
      width: 750px;
      height: 50px;
      padding: 0 10px;
      border-radius: 50px;
      // border: 1px solid rgb(105, 105, 105);
      box-shadow: 2px 5px 10px 1px #b3b3b3;

      .left-icon,
      .right-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 45px;
        padding-top: 5px;
        cursor: pointer;
        color: #242424;
      }

      input {
        flex: 1;
        height: 100%;
        margin-left: 20px;
        font-size: 20px;
        background-color: unset;
      }
    }
  }

  .website-recommend {
    position: absolute;
    top: 350px;
    display: flex;
    // display: grid;
    // grid-gap: 25px;
    // grid-template-columns: repeat(8, 85px);

    .website-item {
      display: flex;
      justify-content: center;
      width: 85px;
      margin-right: 25px;
      text-align: center;
      cursor: pointer;
      font-weight: bold;
      -webkit-text-stroke: 0.2px #242424;

      &:last-child {
        margin-right: 0;
      }
    }

    .website-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 65px;
      height: 65px;
      background-color: rgb(255 255 255 / 80%);
      box-shadow: 0 0 8px 1px #ededed;
      border-radius: 20px;

      img {
        width: 50%;
        border-radius: 10px;
      }
    }

    .website-name {
      width: 100%;
      margin-top: 10px;
      color: #fff;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
