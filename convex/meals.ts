import { action, mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getMealsForDay = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query('meals')
      .withIndex('by_user_date', q =>
        q.eq('userId', identity.subject).eq('date', date),
      )
      .collect();
  },
});

export const saveMeal = mutation({
  args: {
    date: v.string(),
    name: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    return await ctx.db.insert('meals', {
      userId: identity.subject,
      scannedAt: new Date().toISOString(),
      ...args,
    });
  },
});

export const deleteMeal = mutation({
  args: { mealId: v.id('meals') },
  handler: async (ctx, { mealId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const meal = await ctx.db.get(mealId);
    if (!meal || meal.userId !== identity.subject) throw new Error('Not found');
    await ctx.db.delete(mealId);
  },
});

export const scanMeal = action({
  args: { imageBase64: v.string() },
  handler: async (_ctx, { imageBase64 }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                text: 'Analyze this meal photo. Return ONLY a valid JSON object with these exact fields: {"name": "short meal name", "calories": number, "protein": number, "carbs": number, "fat": number}. Estimate realistic portion sizes. All macro values should be integers in grams. Calories should be an integer. No markdown, no explanation, ONLY the JSON object.',
              },
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
          },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${err}`);
    }

    const data = await response.json() as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse meal data from AI response');

    const meal = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    return {
      name: String(meal.name ?? 'Unknown meal'),
      calories: Math.round(Number(meal.calories ?? 0)),
      protein: Math.round(Number(meal.protein ?? 0)),
      carbs: Math.round(Number(meal.carbs ?? 0)),
      fat: Math.round(Number(meal.fat ?? 0)),
    };
  },
});
