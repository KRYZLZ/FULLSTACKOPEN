import { test, expect } from '@playwright/test'
import { createBlog, loginWith } from './helper'

test.describe('Blog App', () => {
  test.beforeEach(async ({ page, request }) => {
    await page.goto('/')

    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'root',
        name: 'root',
        password: 'root',
      },
    })
  })

  test('Front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  test('User can login', async ({ page }) => {
    await loginWith(page, 'root', 'root')

    await expect(page.getByText('root logged in')).toBeVisible()
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'root')
    })

    test('New blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '5',
      })

      await expect(
        page.getByText('a new blog "Test Blog" by Test Author added')
      ).toBeVisible()
    })

    test('User can like a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'First Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '5',
      })

      await createBlog(page, {
        title: 'Second Blog',
        author: 'Test Author 2',
        url: 'https://testblog2.com',
        likes: '2',
      })

      const blogContainer = page.locator('[data-blog-title="First Blog"]')

      await blogContainer.getByRole('button', { name: 'view' }).click()
      await blogContainer.getByRole('button', { name: 'like' }).click()

      await expect(blogContainer.getByText('likes 6')).toBeVisible()
    })

    test('User can delete a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '5',
      })

      const blogContainer = page.locator('[data-blog-title="Blog to Delete"]')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await blogContainer.getByRole('button', { name: 'delete' }).click()

      await expect(blogContainer).not.toBeVisible()
    })

    test('Editing a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Blog to Edit',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '3',
      })

      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('Blog to Edit')
      await page.getByTestId('author').fill('Edited Author')
      await page.getByTestId('url').fill('https://editedblog.com')
      await page.getByTestId('likes').fill('10')

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('Edited Author')).toBeVisible()

      await expect(page.getByText('Updated Blog to Edit')).toBeVisible()
    })

    test('Blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, {
        title: 'First Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '1',
      })
      await createBlog(page, {
        title: 'Second Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '2',
      })
      await createBlog(page, {
        title: 'Third Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: '3',
      })

      const blogs = page.locator('[data-testid="blog"]')
      await expect(blogs).toHaveCount(3)
      await expect(blogs.nth(0)).toContainText('Third Blog')
      await expect(blogs.nth(1)).toContainText('Second Blog')
      await expect(blogs.nth(2)).toContainText('First Blog')
    })
  })

  test('Login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'show login' }).click()

    await page.getByTestId('username').fill('root')
    await page.getByTestId('password').fill('wrong')

    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('invalid user or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  })
})
