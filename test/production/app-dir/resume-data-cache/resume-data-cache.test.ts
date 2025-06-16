import { nextTestSetup } from 'e2e-utils'

describe('resume-data-cache', () => {
  const { next } = nextTestSetup({ files: __dirname })

  it('should have consistent data between static and dynamic renders', async () => {
    // First render the page statically, getting the random number from the
    // HTML.
    let $ = await next.render$('/')
    const first = $('p#random-number').text()

    // Then get the Prefetch RSC and validate that it also contains the same
    // random number.
    let rsc = await next
      .fetch('/', {
        headers: {
          RSC: '1',
          'Next-Router-Prefetch': '1',
        },
      })
      .then((res) => res.text())
    expect(rsc).toContain(first)

    // Then get the dynamic RSC and validate that it also contains the same
    // random number.
    rsc = await next
      .fetch('/', {
        headers: {
          RSC: '1',
        },
      })
      .then((res) => res.text())
    expect(rsc).toContain(first)

    // Then revalidate the page
    await next.fetch('/revalidate', { method: 'POST' })

    // Then get the dynamic RSC again and validate that it still contains the
    // same random number.
    rsc = await next
      .fetch('/', {
        headers: {
          RSC: '1',
        },
      })
      .then((res) => res.text())
    expect(rsc).toContain(first)

    // This proves that the dynamic RSC was able to use the resume data cache
    // (RDC) from the static render to ensure that the data is consistent
    // between the static and dynamic renders. Let's now try to render the
    // page statically and see that the random number changes.

    $ = await next.render$('/')
    const random2 = $('p#random-number').text()
    expect(random2).not.toBe(first)

    // Then get the Prefetch RSC and validate that it also contains the new
    // random number.
    rsc = await next
      .fetch('/', {
        headers: {
          RSC: '1',
          'Next-Router-Prefetch': '1',
        },
      })
      .then((res) => res.text())
    expect(rsc).toContain(random2)

    // Then get the dynamic RSC again and validate that it also contains the
    // new random number.
    rsc = await next
      .fetch('/', {
        headers: {
          RSC: '1',
        },
      })
      .then((res) => res.text())
    expect(rsc).toContain(random2)

    // This proves that the dynamic RSC was able to use the resume data cache
    // (RDC) from the static render to ensure that the data is consistent
    // between the static and dynamic renders.
  })
})
