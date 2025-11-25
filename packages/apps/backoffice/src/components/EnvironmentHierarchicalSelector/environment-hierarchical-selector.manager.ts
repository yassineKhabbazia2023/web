import type { EnvironmentOption } from '@backoffice/types/environment-option.type'
import type { GroupedEnvironment } from './environment-hierarchical-selector.type'

/**
 * Manager for environment hierarchical selector logic
 * Contains pure functions for environment and label selection management
 */
export class EnvironmentHierarchicalSelectorManager {
  /**
   * Groups available environments with their labels
   * @param availableEnvironments - List of available environments with labels
   * @returns Grouped environments
   */
  static groupEnvironments(
    availableEnvironments: EnvironmentOption[],
  ): GroupedEnvironment[] {
    return availableEnvironments.map((envOption) => ({
      environment: envOption.environment,
      labels: envOption.labels,
    }))
  }

  /**
   * Checks if an environment is selected
   * @param selectedEnvironments - List of selected environment strings
   * @param environment - Environment to check
   * @returns True if environment is selected
   */
  static isEnvironmentSelected(
    selectedEnvironments: string[],
    environment: string,
  ): boolean {
    return selectedEnvironments.includes(environment) === true
  }

  /**
   * Checks if a specific label within an environment is selected
   * @param selectedEnvironments - List of selected environment strings
   * @param environment - Environment name
   * @param label - Label to check
   * @returns True if label is selected
   */
  static isLabelSelected(
    selectedEnvironments: string[],
    environment: string,
    label: string,
  ): boolean {
    return selectedEnvironments.includes(`${environment}:${label}`) === true
  }

  /**
   * Handles checkbox toggle for environment or label selection
   * @param selectedEnvironments - Current selected environments
   * @param value - Value to toggle (environment or environment:label)
   * @param isChecked - New checked state
   * @returns Updated list of selected environments
   */
  static handleCheckboxToggle(
    selectedEnvironments: string[],
    value: string,
    isChecked: boolean,
  ): string[] {
    const newValue = [...selectedEnvironments]

    if (isChecked === true) {
      if (newValue.includes(value) === false) {
        newValue.push(value)
      }
    } else {
      const index = newValue.indexOf(value)
      if (index !== -1) {
        newValue.splice(index, 1)
      }
    }

    return newValue
  }
}
