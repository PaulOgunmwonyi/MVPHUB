from typing import Dict, List

class SimpleExplainer:
    """Simple explainer using Josh Allen's 2024 MVP stats as baseline"""
    
    def __init__(self):
        # Josh Allen's 2024 MVP baseline stats
        self.josh_allen_baseline = {
            'wins': 13,
            'passing_yards': 4306,
            'passing_tds': 28,
            'interceptions': 6,
            'passer_rating': 99.6,
            'qbr_total': 68.2,
            'epa_total': 85.4,
            'epa_per_play': 0.142,
            'qb_plays': 601,
            'sacks': 23,
            'rushing_yards': 523,
            'rushing_tds': 15
        }
        
        self.feature_names = [
            'wins', 'passing_yards', 'passing_tds', 'interceptions',
            'passer_rating', 'qbr_total', 'epa_total', 'epa_per_play',
            'qb_plays', 'sacks', 'rushing_yards', 'rushing_tds'
        ]
        
        # Define what constitutes good/bad performance relative to MVP level
        self.feature_importance = {
            'wins': {'weight': 0.25, 'direction': 'higher'},
            'passing_tds': {'weight': 0.20, 'direction': 'higher'},
            'passer_rating': {'weight': 0.15, 'direction': 'higher'},
            'qbr_total': {'weight': 0.12, 'direction': 'higher'},
            'epa_total': {'weight': 0.10, 'direction': 'higher'},
            'rushing_tds': {'weight': 0.08, 'direction': 'higher'},
            'interceptions': {'weight': 0.08, 'direction': 'lower'},
            'sacks': {'weight': 0.05, 'direction': 'lower'},
            'passing_yards': {'weight': 0.04, 'direction': 'higher'},
            'epa_per_play': {'weight': 0.04, 'direction': 'higher'},
            'rushing_yards': {'weight': 0.03, 'direction': 'higher'},
            'qb_plays': {'weight': 0.02, 'direction': 'higher'}
        }
    
    def explain_prediction(self, input_data: Dict) -> Dict:
        """Compare input stats to Josh Allen's MVP baseline"""
        comparisons = []
        total_score = 0
        
        for feature in self.feature_names:
            user_value = input_data.get(feature, 0)
            baseline_value = self.josh_allen_baseline[feature]
            feature_info = self.feature_importance[feature]
            
            # Calculate percentage difference
            if baseline_value != 0:
                pct_diff = ((user_value - baseline_value) / baseline_value) * 100
            else:
                pct_diff = 0
            
            # Determine if this is good or bad
            if feature_info['direction'] == 'higher':
                is_better = user_value >= baseline_value
                impact_score = min(pct_diff / 100, 1.0) * feature_info['weight']
            else:  # 'lower' is better
                is_better = user_value <= baseline_value
                impact_score = min(-pct_diff / 100, 1.0) * feature_info['weight']
            
            total_score += impact_score
            
            comparison = {
                'feature': feature.replace('_', ' ').title(),
                'user_value': user_value,
                'baseline_value': baseline_value,
                'percentage_diff': pct_diff,
                'is_better': is_better,
                'impact_score': impact_score,
                'impact': 'positive' if impact_score > 0 else 'negative'
            }
            comparisons.append(comparison)
        
        # Sort by absolute impact score
        comparisons.sort(key=lambda x: abs(x['impact_score']), reverse=True)
        
        return {
            'prediction_probability': min(max(0.5 + total_score, 0.0), 1.0),
            'total_score': total_score,
            'baseline_player': 'Josh Allen (2024 MVP)',
            'feature_impacts': comparisons,
            'top_positive': [f for f in comparisons if f['impact'] == 'positive'][:3],
            'top_negative': [f for f in comparisons if f['impact'] == 'negative'][:3]
        }
    
    def get_improvement_suggestions(self, input_data: Dict) -> List[Dict]:
        """Get improvement suggestions based on Josh Allen comparison"""
        explanation = self.explain_prediction(input_data)
        suggestions = []
        
        for feature in explanation['top_negative'][:2]:
            suggestion = self._get_feature_suggestion(feature)
            if suggestion:
                suggestions.append(suggestion)
        
        return suggestions
    
    def _get_feature_suggestion(self, feature_comparison: Dict) -> Dict:
        """Generate improvement suggestion for a specific feature"""
        feature = feature_comparison['feature'].lower().replace(' ', '_')
        user_value = feature_comparison['user_value']
        baseline_value = feature_comparison['baseline_value']
        
        suggestions_map = {
            'interceptions': {
                'message': f'Reduce interceptions to MVP level. Josh Allen threw only {baseline_value} INTs in 2024.',
                'target': baseline_value
            },
            'sacks': {
                'message': f'Improve pocket presence. Josh Allen was sacked only {baseline_value} times in 2024.',
                'target': baseline_value
            },
            'wins': {
                'message': f'Team success is crucial. Josh Allen\'s Bills won {baseline_value} games in 2024.',
                'target': baseline_value
            },
            'passing_tds': {
                'message': f'Increase touchdown passes. Josh Allen threw {baseline_value} TDs in 2024.',
                'target': baseline_value
            },
            'passer_rating': {
                'message': f'Improve passer rating to MVP level. Josh Allen had a {baseline_value} rating in 2024.',
                'target': baseline_value
            },
            'rushing_tds': {
                'message': f'Add rushing touchdowns. Josh Allen scored {baseline_value} rushing TDs in 2024.',
                'target': baseline_value
            }
        }
        
        return suggestions_map.get(feature, {
            'message': f'Improve {feature_comparison["feature"]} to match MVP level performance',
            'target': baseline_value
        })