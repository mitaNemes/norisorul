export const getGoogleConsentUrl = () => {
  fetch("/getGoogleConsentUrl")
    .then((response) => {
      return response.json();
    })
    .then((consentUrl) => {
      window.location.href = consentUrl
    })
    .catch((error) => {
      throw new Error("Get Conesent Url failed", error.message);
    })
};

export const getGoogleUser = (code) => {
  const queryParam = new URLSearchParams({
    code
  })

  window.history.pushState("", "", "/");

  return fetch(`/getGoogleUser?${queryParam}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw new Error("Get Conesent Url failed", error.message);
    })
}