const elBtn = document.getElementById("btn");
const elContainer = document.getElementById("container");

function clickHandler(controller) {
  let innerCount = 0;
  const newDiv = document.createElement("div");
  const newSpan = document.createElement("span");

  newDiv.classList.add("meter", "orange", "nostripes");
  newSpan.style.width = "0%";
  newDiv.appendChild(newSpan);
  elContainer.appendChild(newDiv);
  controller.enqueue({
    el: newDiv,
    innerCount: innerCount,
  });
}

const readableStream = new ReadableStream({
  start(controller) {
    elBtn.addEventListener("click", () => clickHandler(controller));
  },
});

const writableStream = new WritableStream({
  async write(chunk) {
    const { el } = chunk;
    const span = el.firstChild;
    await new Promise((resolve) => {
      const myInterval = setInterval(() => {
        chunk.innerCount += 1;
        span.style.width = `${chunk.innerCount}%`;
        if (chunk.innerCount === 100) {
          clearInterval(myInterval);
          resolve();
        }
      }, 50);
    });
  },
});

async function main() {
  await readableStream.pipeTo(writableStream);
}

main();
