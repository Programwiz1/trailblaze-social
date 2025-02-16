import { supabase } from "@/integrations/supabase/client";

export const getTrailUUID = (id: string) => {
  // If the ID is already a UUID, return it as is
  if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    return id;
  }
  // Otherwise, return null to indicate invalid ID
  return null;
};

export const checkTrailStatus = async (trailId: string, userId: string) => {
  const trailUUID = getTrailUUID(trailId);
  
  // If the trail ID is not a valid UUID, return default values
  if (!trailUUID) {
    return {
      isSaved: false,
      isCompleted: false
    };
  }

  const [{ data: savedData }, { data: completionData }] = await Promise.all([
    supabase
      .from('saved_trails')
      .select('id')
      .eq('trail_id', trailUUID)
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('trail_completions')
      .select('id')
      .eq('trail_id', trailUUID)
      .eq('user_id', userId)
      .maybeSingle()
  ]);

  return {
    isSaved: !!savedData,
    isCompleted: !!completionData
  };
};

export const saveTrail = async (
  trailId: string, 
  userId: string, 
  trailData: {
    name: string;
    image: string;
    difficulty: string;
    rating: number;
    distance: number;
    time: string;
  }
) => {
  const trailUUID = getTrailUUID(trailId);
  if (!trailUUID) {
    throw new Error('Invalid trail ID format');
  }
  
  const { error } = await supabase
    .from('saved_trails')
    .insert([{ 
      trail_id: trailUUID, 
      user_id: userId,
      trail_name: trailData.name,
      trail_image: trailData.image,
      trail_difficulty: trailData.difficulty,
      trail_rating: trailData.rating,
      trail_distance: trailData.distance,
      trail_time: trailData.time
    }]);

  if (error) throw error;
};

export const unsaveTrail = async (trailId: string, userId: string) => {
  const trailUUID = getTrailUUID(trailId);
  if (!trailUUID) {
    throw new Error('Invalid trail ID format');
  }
  
  const { error } = await supabase
    .from('saved_trails')
    .delete()
    .eq('trail_id', trailUUID)
    .eq('user_id', userId);

  if (error) throw error;
};

export const completeTrail = async (
  trailId: string,
  userId: string,
  completionData: {
    rating: number;
    reviewText: string;
    difficultyRating: string;
    durationMinutes: number;
  },
  trailDetails: {
    name: string;
    image: string;
    difficulty: string;
    rating: number;
    distance: number;
    time: string;
  }
) => {
  const trailUUID = getTrailUUID(trailId);
  if (!trailUUID) {
    throw new Error('Invalid trail ID format');
  }

  const { error: completionError } = await supabase
    .from('trail_completions')
    .insert([{
      trail_id: trailUUID,
      user_id: userId,
      rating: completionData.rating,
      review_text: completionData.reviewText,
      difficulty_rating: completionData.difficultyRating,
      duration_minutes: completionData.durationMinutes,
      trail_name: trailDetails.name,
      trail_image: trailDetails.image,
      trail_difficulty: trailDetails.difficulty,
      trail_distance: trailDetails.distance,
      trail_time: trailDetails.time
    }]);

  if (completionError) throw completionError;
};

export const uncompleteTrail = async (trailId: string, userId: string) => {
  const trailUUID = getTrailUUID(trailId);
  if (!trailUUID) {
    throw new Error('Invalid trail ID format');
  }

  const { error } = await supabase
    .from('trail_completions')
    .delete()
    .eq('trail_id', trailUUID)
    .eq('user_id', userId);

  if (error) throw error;
};
