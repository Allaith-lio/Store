async function postUser() {
  try {
    const data = await fetch(`https://jsonplaceholder.typicode.com/users/2`);
    const datares = await data.json();
    if (!datares.ok) throw new Error("Eror");
    console.log(datares);
    let isLoading = true;
    console.log(datares);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading = false;
    console.log("isLoading is now", isLoading);
  }
}
postUser();
queueMicrotaskw;
