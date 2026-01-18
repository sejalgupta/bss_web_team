# Framer Setup Instructions - Home Page Issue

## Current Problem
Home page shows in Framer preview but not on published site.

## Step-by-Step Fix

### Step 1: Test with Simple Component
1. Open your Framer project
2. Go to the **Home page** (the one that's not working)
3. **Delete everything** on the page (select all layers in the Layers panel and delete)
4. From the toolbar, click **Insert** → **Code** (or press C)
5. In the code editor that appears:
   - Delete any existing code
   - Copy and paste the ENTIRE contents of `HomePageSimple.tsx`
   - This should show a purple gradient with white text saying "TEST - Component is Rendering"
6. **Important**: In the canvas, select the code component and:
   - Set Width to **100%** (or drag it to fill the entire canvas width)
   - Set Height to **100vh** (or type it in the height field)
   - Make sure X position = 0, Y position = 0
7. Click **Publish** (top right)
8. Open the published site in a new browser tab

**Expected Result:** You should see a purple gradient background with white text.

**If you DON'T see this:**
- The issue is with how the code component is set up in Framer, not with the code itself
- Check that the page doesn't have any other components covering the code component
- Check that the code component is actually on the page (look in Layers panel)

**If you DO see this:**
- The code component works! Continue to Step 2

---

### Step 2: Use the Full Home Page Component

Once the simple test works:

1. Go back to Framer
2. Select the code component on your Home page
3. Replace the code with the contents of `HomePageFramer.tsx`
4. Make sure the code component still fills the page (Width: 100%, Height: 100vh)
5. Publish again

---

## Common Issues

### Issue: "I don't see the code component option"
- Make sure you're clicking **Insert** → **Code** (not "Code Block" or "Code File")
- The icon looks like `</>`

### Issue: "The component shows in preview but not published"
- The code component might not be sized correctly
- Try setting explicit width/height: `width: '100vw', height: '100vh'` in the outermost div

### Issue: "I see a blank space where the component should be"
- Check browser console (F12) for errors
- Make sure the code component layer is on top of other layers (not behind something)
- Check that the code component's background isn't transparent

### Issue: "Cards don't navigate properly"
- For now, the cards use `window.location.href` which will do a full page reload
- Make sure your Elementary, Middle, and High School pages exist in Framer with the exact paths:
  - `/elementary`
  - `/middle`
  - `/high`

---

## File Guide

**Use these files in this order:**

1. **HomePageSimple.tsx** - Use this FIRST to test if code components work at all
2. **HomePageFramer.tsx** - Use this once Simple works (full featured home page)
3. **HomePageInline.tsx** - Original version (has debugging added)

---

## Framer-Specific Tips

1. **Code components must be sized explicitly** - They don't automatically fill the page
2. **Preview mode vs Published** - Sometimes they render differently
3. **No Tailwind** - Must use inline styles (which we're already doing)
4. **Navigation** - Use `window.location.href` or Framer's built-in page links

---

## What to Check Next

If the simple test component DOESN'T work, the issue is:
- ❌ Code component not properly inserted
- ❌ Code component not visible (behind other elements or off-canvas)
- ❌ Code component not sized to fill the page

If the simple test component DOES work but the full version doesn't:
- The issue is in the HomePageFramer code itself
- Check browser console for JavaScript errors
