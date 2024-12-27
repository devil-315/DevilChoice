//封装本地存储数据与读取数据方法
//存储数据
export const SET_TOKEN = () => {
  localStorage.setItem('TOKEN','eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSSkzJzcxT0lFKrShQsjI0MzQzMTK1NDGvBQApMebnIAAAAA.UG2Qj7F7ASMLBugNG67-wKs0Un6ORrneMkSdio0rKhX0o-fd6BC24T1gCzfVVtsNERPzs4Sjwz8JOyPfLazUSA')
  localStorage.setItem('Token','eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSSkzJzcxT0lFKrShQsjI0MzQzMTK1NDGvBQApMebnIAAAAA.UG2Qj7F7ASMLBugNG67-wKs0Un6ORrneMkSdio0rKhX0o-fd6BC24T1gCzfVVtsNERPzs4Sjwz8JOyPfLazUSA')
}

//获取数据
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}

//删除本地数据
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}