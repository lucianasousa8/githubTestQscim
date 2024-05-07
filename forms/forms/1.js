let form = document.getElementById("form");
  const submitBtn = document.getElementById("submit_btn");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedConnectors = [{
        url: ":888/users",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("rai123:rai123"),
        },
      }];
  
    await formHandler(e, form, submitBtn, selectedConnectors);
  });
  