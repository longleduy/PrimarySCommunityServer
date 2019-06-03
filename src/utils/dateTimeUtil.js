export const convertPostTime = (dateTime) => {
    const currentDateTime = new Date();
    const h = currentDateTime - dateTime;
    const postTimeMin = Math.floor(h/60000);
    if(postTimeMin < 2){
      return `Vừa xong`
    }
    else if(postTimeMin >= 2 && postTimeMin <60){
      return `${postTimeMin} phút`
    }
    else if(postTimeMin>=60 && postTimeMin < 60*24){
      const postTimeHour = Math.floor(postTimeMin/60);
      if(postTimeHour == 1){
        return '1 giờ'
      }
      return `${postTimeHour} giờ`
    }
    else if(postTimeMin >= 60*24 && postTimeMin < 60*24*2){
      return `1 ngày`
    }
    else{
      const date = new Date(dateTime);
      return date.toDateString();
    }
  }